// import type { IKeys } from "../../../../../../client/src/requests/queries";

export type TRingGroupDetails = [
  {
    context: string;
    destinations: `{${string}}`;
    duration: string;
    dialplan_uuid: string;
    domain_description: string;
    domain_enabled: string;
    domain_name: string;
    domain_parent_uuid: string;
    domain_uuid: string;
    extension: string;
    insert_date: string | null;
    insert_user: string;
    name: string;
    record_calls: boolean;
    ring_group_call_forward_enabled: string;
    ring_group_call_screen_enabled: null;
    ring_group_call_timeout: string;
    ring_group_caller_id_name: string;
    ring_group_caller_id_number: string;
    ring_group_cid_name_prefix: null;
    ring_group_cid_number_prefix: null;
    ring_group_context: string;
    ring_group_description: string;
    ring_group_distinctive_ring: null;
    ring_group_enabled: string;
    ring_group_extension: string;
    ring_group_follow_me_enabled: string;
    ring_group_forward_destination: string;
    ring_group_forward_enabled: string;
    ring_group_forward_toll_allow: string;
    // TODO: IKeys
    remote_no_answer_strategy: "extension" | "conference" | "ivr" | "ringGroup" | "recording" | "dialplan";
    endpoint_uuid: string;
    ring_group_greeting: string;
    ring_group_missed_call_app: string;
    ring_group_missed_call_data: string;
    ring_group_name: string;
    ring_group_ringback: string;
    ring_group_strategy: "simultaneous" | "sequence";
    ring_group_timeout_app: string;
    ring_group_timeout_data: string;
    ring_group_uuid: string;
  }
]