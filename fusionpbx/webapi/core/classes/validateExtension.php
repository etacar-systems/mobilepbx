<?php
require("../../config/config.php");
require("../../vendor/autoload.php");

class validateExtension
{
	
  	public static function validate($con,$extension,$domain_uuid,$uuid = '')
    {   
        
        $check_ivr = validateExtension::fetch_ivr_by_domain($con,$domain_uuid, $extension,$uuid);

        if (pg_num_rows($check_ivr) > 0 ) {

            while ($row = pg_fetch_assoc($check_ivr)) {
                //$arr[] = $row;
                return array('app'=>'IVR Menus', 'extension' => $row['ivr_menu_extension']);
            }

        } 

        $check_ringgroup = validateExtension::fetch_ringgroup_by_domain($con,$domain_uuid, $extension,$uuid);

        if (pg_num_rows($check_ringgroup) > 0 ) {

            while ($row = pg_fetch_assoc($check_ringgroup)) {
                //$arr[] = $row;
                return array('app'=>'Ring Group', 'extension' => $row['ring_group_extension']);
            }

        }


        $check_extension = validateExtension::fetch_extension_by_domain($con,$domain_uuid, $extension,$uuid);

        if (pg_num_rows($check_extension) > 0 ) {

            while ($row = pg_fetch_assoc($check_extension)) {
                //$arr[] = $row;
                return array('app'=>'Extension', 'extension' => $row['extension']);
            }

        }


        $check_conference = validateExtension::fetch_conference_by_domain($con,$domain_uuid, $extension,$uuid);

        if (pg_num_rows($check_conference) > 0 ) {

            while ($row = pg_fetch_assoc($check_conference)) {
                //$arr[] = $row;
                return array('app'=>'conference', 'extension' => $row['conference_extension']);
            }

        }

        $check_timecondition = validateExtension::fetch_timecondtion_by_domain($con,$domain_uuid, $extension,$uuid);

        if (pg_num_rows($check_timecondition) > 0 ) {

            while ($row = pg_fetch_assoc($check_timecondition)) {
                //$arr[] = $row;
                return array('app'=>'Time Condition', 'extension' => $row['dialplan_number']);
            }

        }

        return true;

    }

    public static function validate_ext_dial_rule($con,$extension,$domain_uuid,$uuid = '')
    {   
        
        $check_ivr = validateExtension::fetch_ivr_by_domain($con,$domain_uuid, $extension,$uuid);

        if (pg_num_rows($check_ivr) > 0 ) {

            while ($row = pg_fetch_assoc($check_ivr)) {
                //$arr[] = $row;
                return array('app'=>'IVR Menus', 'extension' => $row['ivr_menu_extension']);
            }

        } 

        $check_ringgroup = validateExtension::fetch_ringgroup_by_domain($con,$domain_uuid, $extension,$uuid);

        if (pg_num_rows($check_ringgroup) > 0 ) {

            while ($row = pg_fetch_assoc($check_ringgroup)) {
                //$arr[] = $row;
                return array('app'=>'Ring Group', 'extension' => $row['ring_group_extension']);
            }

        }


/*        $check_extension = validateExtension::fetch_extension_by_domain($con,$domain_uuid, $extension,$uuid);

        if (pg_num_rows($check_extension) > 0 ) {

            while ($row = pg_fetch_assoc($check_extension)) {
                //$arr[] = $row;
                return array('app'=>'Extension', 'extension' => $row['extension']);
            }

        }
*/

        $check_conference = validateExtension::fetch_conference_by_domain($con,$domain_uuid, $extension,$uuid);

        if (pg_num_rows($check_conference) > 0 ) {

            while ($row = pg_fetch_assoc($check_conference)) {
                //$arr[] = $row;
                return array('app'=>'conference', 'extension' => $row['conference_extension']);
            }

        }

        $check_timecondition = validateExtension::fetch_timecondtion_by_domain($con,$domain_uuid, $extension,$uuid);

        if (pg_num_rows($check_timecondition) > 0 ) {

            while ($row = pg_fetch_assoc($check_timecondition)) {
                //$arr[] = $row;
                return array('app'=>'Time Condition', 'extension' => $row['dialplan_number']);
            }

        }

        return true;

    }
    public static function fetch_ivr_by_domain($con,$domain_uuid, $extension,$uuid) {
        $query = "SELECT ivr_menu_extension FROM public.v_ivr_menus 
        WHERE v_ivr_menus.domain_uuid = '$domain_uuid' and ivr_menu_extension = '$extension' ";
        if(strlen($uuid) > 0){
            $query .= " and ivr_menu_uuid != '$uuid' ";
        }
        $result = pg_query($con, $query);
        return $result;
    }

    public static function fetch_ringgroup_by_domain($con,$domain_uuid, $extension,$uuid) {
        $query = "SELECT ring_group_extension FROM public.v_ring_groups 
        WHERE v_ring_groups.domain_uuid = '$domain_uuid' and ring_group_extension = '$extension' ";
        if(strlen($uuid) > 0){
            $query .= " and ring_group_uuid != '$uuid' ";
        }
        $result = pg_query($con, $query);
        return $result;
    }

    public static function fetch_extension_by_domain($con,$domain_uuid, $extension,$uuid) {
        $query = "SELECT extension FROM public.v_extensions 
        WHERE v_extensions.domain_uuid = '$domain_uuid' and extension = '$extension' ";
        if(strlen($uuid) > 0){
            $query .= " and extension_uuid != '$uuid' ";
        }
        $result = pg_query($con, $query);
        return $result;
    }


    public static function fetch_conference_by_domain($con,$domain_uuid, $extension,$uuid) {
        $query = "SELECT conference_center_extension FROM public.v_conference_centers 
        WHERE v_conference_centers.domain_uuid = '$domain_uuid' and conference_center_extension = '$extension' ";
        if(strlen($uuid) > 0){
            $query .= " and conference_center_uuid != '$uuid' ";
        }
        $result = pg_query($con, $query);
        return $result;
    }

    public static function fetch_timecondtion_by_domain($con,$domain_uuid, $extension,$uuid) {

        $app_uuid = '4b821450-926b-175a-af93-a03c441818b1';

        $query = "SELECT dialplan_number FROM public.v_dialplans 
        WHERE v_dialplans.domain_uuid = '$domain_uuid' and dialplan_number = '$extension' and app_uuid = '$app_uuid' ";
        if(strlen($uuid) > 0){
            $query .= " and dialplan_uuid != '$uuid' ";
        }
        $result = pg_query($con, $query);
        return $result;
    }

	
}
