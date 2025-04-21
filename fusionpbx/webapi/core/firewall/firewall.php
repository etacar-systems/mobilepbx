<?php
    require("../../config/config.php");
    require("../../vendor/autoload.php");

    //require("../../../resources/classes/event_socket.php");
    require("../classes/SocketConnection.php");
    
    
    use Ramsey\Uuid\Uuid;

    class Firewall {

        public function verify_user($con, $username, $password) {
            $query = "SELECT * FROM public.v_users WHERE username = '$username'";
            $result = pg_query($con,$query);
            $admin = pg_fetch_array($result);
        
            if (!empty($admin)) {
                if (password_verify($password, $admin['password'])) {
                    $data = json_encode([
                        'msg' => 'true',
                        'id' => $admin['user_uuid']
                    ]);
                    return $data;
                } else {
                    $data = json_encode([
                        'msg' => 'false',
                    ]);
                    return $data;   
                }
                
            } else {
                $data = json_encode([
                    'msg' => 'false',
                ]);
                return $data;
            }
        }

        public function fetch($con) {
            $query = 'SELECT * FROM public.v_access_controls';
            $result = pg_query($con, $query);
            return $result;
        }

        public function fetch_firewall_by_id($con, $id) {
            $query = "SELECT * FROM public.v_access_controls WHERE access_control_uuid = '$id'";
            $result = pg_query($con, $query);
            return $result;
        }

        public function fetch_firewall_nodes_by_id($con, $id) {
            $query = "SELECT * FROM public.v_access_control_nodes WHERE access_control_uuid = '$id'";
            $result = pg_query($con, $query);
            return $result;
        }

        public function post($con, $uuidString, $access_control_name, $access_control_default, $access_control_description, $access_control_nodes, $userID) {

            if (empty(trim($access_control_name))) {
                echo json_encode([
                    "msg"     => 'access control name Cannot be EMPTY !'
                ]);
                return;
            } elseif (empty(trim($access_control_default))) {
                echo json_encode([
                    "msg"     => 'access control default Cannot be EMPTY !'
                ]);
                return;
            } 
                $date = date('Y-m-d H:i:s');
            
                // $userID = '3d7c90a5-3936-422a-8fac-4dbfbea35237';
                $insertFirewall = "INSERT INTO public.v_access_controls (access_control_uuid, access_control_name, access_control_default, access_control_description, insert_date,insert_user) VALUES ('$uuidString', '$access_control_name', '$access_control_default', '$access_control_description', '$date' ,'$userID')";
                $resultFirewall = pg_query($con, $insertFirewall);
                if ($resultFirewall) {
                    
                    if(!empty($access_control_nodes)){
                        foreach ($access_control_nodes as $k) {

                            $uuid = Uuid::uuid4();                            
                            $access_control_node_uuid = $uuid->toString();
                            $node_type = $k->node_type;
                            $node_cidr = $k->node_cidr;
                            $node_description = $k->node_description;

                            $insertNodes = "INSERT INTO public.v_access_control_nodes (access_control_node_uuid, access_control_uuid, node_type, node_cidr, node_description, insert_date,insert_user) VALUES ('$access_control_node_uuid','$uuidString', '$node_type', '$node_cidr', '$node_description','$date' ,'$userID')";
                            $resultNodes = pg_query($con, $insertNodes);
                        }
                    }

                    //create the event socket connection
                    //event_socket::api("reloadacl");

                    $fp = SocketConnection::_event_socket_create();
                    $json = SocketConnection::_event_socket_request($fp, "reloadacl");

                    echo json_encode([
                        "message" => "Firewall Created Successfully !!",
                        "id"      => $uuidString
                    ]);            
                    return;
                } else {
                    echo json_encode([
                        "message" => "Failed to Create Firewall, Try Again !!"
                    ]);            
                    return;
                }
               
        }

        public function update($con, $access_control_id, $access_control_name, $access_control_default, $access_control_description, $access_control_nodes, $userID) {

                if (empty(trim($access_control_name))) {
                    echo json_encode([
                        "msg"     => 'access control name Cannot be EMPTY !'
                    ]);
                    return;
                } elseif (empty(trim($access_control_default))) {
                    echo json_encode([
                        "msg"     => 'access control default Cannot be EMPTY !'
                    ]);
                    return;
                } 

                $editFirewall = "UPDATE public.v_access_controls SET 
                access_control_name = '$access_control_name', 
                access_control_default = '$access_control_default', 
                access_control_description = '$access_control_description'
                WHERE access_control_uuid = '$access_control_id'";
                $result = pg_query($con, $editFirewall);
                if ($result) {

                    $query = "DELETE FROM public.v_access_control_nodes WHERE access_control_uuid = '$access_control_id'";
                    pg_query($con, $query);

                    $date = date('Y-m-d H:i:s');

                    if(!empty($access_control_nodes)){
                        foreach ($access_control_nodes as $k) {

                            $uuid = Uuid::uuid4();                            
                            $access_control_node_uuid = $uuid->toString();
                            $node_type = $k->node_type;
                            $node_cidr = $k->node_cidr;
                            $node_description = $k->node_description;

                            $insertNodes = "INSERT INTO public.v_access_control_nodes (access_control_node_uuid, access_control_uuid, node_type, node_cidr, node_description, insert_date,insert_user) VALUES ('$access_control_node_uuid','$access_control_id', '$node_type', '$node_cidr', '$node_description','$date' ,'$userID')";
                            $resultNodes = pg_query($con, $insertNodes);
                        }
                    }

                    //create the event socket connection
                    //event_socket::api("reloadacl");

                    $fp = SocketConnection::_event_socket_create();
                    $json = SocketConnection::_event_socket_request($fp, "reloadacl");

                    echo json_encode([
                        "message" => "Firewall updated Successfully !!"
                    ]);            
                    return;
                } else {
                    echo json_encode([
                        "message" => "Failed to Update Firewall, Try Again !!"
                    ]);            
                    return;
                }     
        }

        public function delete($con, $id) {
            $query = "DELETE FROM public.v_access_controls WHERE access_control_uuid = '$id'";
           
            $result = pg_query($con, $query);
            if ($result) {
                pg_query($con, "DELETE FROM public.v_access_control_nodes WHERE access_control_uuid = '$id'");
                echo json_encode([
                    "message" => "Domain Firewall Successfully !!"
                ]);            
                return;
            } else {
                echo json_encode([
                    "message" => "Failed to Delete Firewall, Try Again !!"
                ]);            
                return;
            }
        }


    }
?>