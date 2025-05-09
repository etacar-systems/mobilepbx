const REGEXP = {
  ENTERPRISE: {
    NAME: /^[a-zA-Z0-9][a-zA-Z0-9_ ]{0,63}$/,
    STATUS: /^[AN]$/,
    SIP_DOMAIN:/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/,
    SIP_DOMAIN_MTC: /^[a-zA-Z0-9.]+$/,
    password:/^[a-zA-Z0-9!@#$%^&*()_+{}|;:'",.<>?/\-=\[\]\s\\]{4,15}$/,
    contactAddress:/^.{1,350}$/,
    billingAddress:/^.{1,350}$/,
  },
  ACCESSGROUP: {
    NAME: /^[a-zA-Z0-9][a-zA-Z0-9_ ]{0,63}$/,
    PROFILE_TYPE: /^[12]$/,
  },
  USER: {
    subscriberActivate:/^[YN]$/,
    first_name:/^[a-zA-Z0-9][a-zA-Z0-9 .-_]{1,200}$/,
    last_name:/^[a-zA-Z0-9][a-zA-Z0-9 .-_]{1,200}$/,
    pin:/^.{1,15}$/,
    password:/^[A-Za-z0-9!@#$%^&*()_+{}|;:'",.<>?/\\[\]\-=`~]{4,15}$/,
    stdpassword:/^\d{0,15}$/,
    user_extension:/^\d{1,15}$/,
    callerId:/^\d{1,15}$/,
    internalCallerID:/^\d{0,15}$/,
    subscriberGroup:/^[A-Za-z0-9_]{1,24}$/,
    isVoiceMailEnable:/^(on|off)$/,
    vmsPassword:/^\d{3,15}$/,
    accountType:/^[YN]$/,
    suspendStatus:/^[YN]$/,
    destAddrString:/^[0-9]+$/,
    state:/^[AI]$/,
    creditLimit:/^(?=.*\d)[\d.]{1,50}$/,
    units:/^(?=.*\d)[\d.]{1,50}$/,
    user_email:/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  },
  COMMON: {
    BOOLEAN: /^[01]$/,
    INTEGER: /^\d+$/,
    EMAIL: /^([A-Za-z0-9_\-\.+])+\@([A-Za-z0-9_\-\.+])+\.([A-Za-z]{2,4})$/,
    PHONENUMBER: /^[0-9]{3,20}$/,
    IPADDRESS:/^(?=\d+\.\d+\.\d+\.\d+$)(?:(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\.?){4}$/,
    IPADDRESS_MTC:/^[a-zA-Z0-9.]+$/,
    PORT:/^[0-9]{1,5}$/,
    LENGTH50: /^.{1,50}$/,
    blnakString:/^\s*$/
  },
  SUB_ADMIN:{
    NAME: /^.{1,50}$/,
    EMAIL:/^.{1,254}$/,
    PHONENUMBER: /^[0-9]{3,20}$/,
    access_profile_type:/^[12]$/,
    user_status:/^[01]$/,
    user_address:/^.{1,350}$/
  },
  ADMIN_API:{
    enterpriseActivate:/^[AD]$/,
    enterpriseName:/^[a-zA-Z0-9][a-zA-Z0-9_ ]{0,63}$/,
    sipDomain:/^[a-zA-Z0-9.]+$/,
    noOfSubscriber:/^\d{1,5}$/,
    noOfConcurrencyCall:/^\d{1,5}$/,
    contactAddress:/^.{1,350}$/,
    phoneNumber:/^[0-9]{3,20}$/,
    emailAddress:/^([A-Za-z0-9_\-\.+])+\@([A-Za-z0-9_\-\.+])+\.([A-Za-z]{2,4})$/,
    billingAddress:/^.{1,150}$/,
    base64:/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/,
    subscriberActivate:/^[YN]$/,
    firstName:/^[a-zA-Z0-9][a-zA-Z0-9 .-_]{1,200}$/,
    lastName:/^[a-zA-Z0-9][a-zA-Z0-9 .-_]{1,200}$/,
    pin:/^.{1,15}$/,
    password:/^[A-Za-z0-9!@#$%^&*()_+{}|;:'",.<>?/\\[\]\-=`~]{4,15}$/,
    stdpassword:/^\d{0,15}$/,
    endpointNumber:/^\d{1,15}$/,
    callerId:/^\d{1,15}$/,
    internalCallerID:/^\d{0,15}$/,
    subscriberGroup:/^[A-Za-z0-9_]{1,24}$/,
    isVoiceMailEnable:/^(on|off)$/,
    vmsPassword:/^\d{3,15}$/,
    accountType:/^[Y]$/,
    suspendStatus:/^[YN]$/,
    borderAgent:/^[012]$/,
    MobileNumber:/^[0-9]{3,20}$/,
    incommingDIDNumbers:/^[0-9]{5,15}$/,
    creditLimit:/^(?=.*\d)[\d.]{1,50}$/,
    units:/^(?=.*\d)[\d.]{1,50}$/,
    Port:/^[0-9]{1,5}$/,
    ipAddress:/^[a-zA-Z0-9.]+$/,
    SecondoryPort:/^[0-9]{1,5}$/,
    SecondoryipAddress:/^[a-zA-Z0-9.]+$/
  },
  contact:{
    contact_name:/^[a-zA-Z0-9][a-zA-Z0-9_ ]{0,63}$/,
    contact_number:/^[0-9+]{3,20}$/,
    contact_add_status:/^[01]$/
  },
  company:{
    company_username:/^.{1,50}$/,
    company_password:/^[A-Za-z0-9!@#$%^&*()_+{}|;:'",.<>?/\\[\]\-=`~]{4,15}$/,
    company_name:/^.{1,50}$/,
    company_email:/^([A-Za-z0-9_\-\.+])+\@([A-Za-z0-9_\-\.+])+\.([A-Za-z]{2,4})$/
  },
  extension:{
    first_name:/^[a-zA-Z0-9][a-zA-Z0-9 .-_]{1,200}$/,
    last_name:/^[a-zA-Z0-9][a-zA-Z0-9 .-_]{1,200}$/,
    password:/^[A-Za-z0-9!@#$%^&*()_+{}|;:'",.<>?/\\[\]\-=`~]{4,15}$/,
    email:/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    mobile:/^[0-9]{3,20}$/,
    extension_number:/^\d{1,15}$/
  },
  ring_gorup:{
    ring_group_name:/^[a-zA-Z0-9][a-zA-Z0-9 .-_]{1,200}$/,
    ring_group_description:/^[a-zA-Z0-9][a-zA-Z0-9 .-_]{1,200}$/,
    ring_group_phone_number:/^[0-9]{3,20}$/,
    ring_group_strategy:/^[12]$/,
    remote_no_answer:/^[1234]$/,
    no_answer_endpoint:/^[1]$/
  },
  outbound_route:{
    prepend:/^[a-zA-Z0-9][a-zA-Z0-9 .-_]{1,200}$/,
    prefix:/^[a-zA-Z0-9][a-zA-Z0-9 .-_]{1,200}$/,
    match_pattern:/^[a-zA-Z0-9][a-zA-Z0-9 .-_]{1,200}$/
  },
  firewall:{
    firewall_network:/^[a-zA-Z0-9][a-zA-Z0-9 .-_]{1,200}$/,
    firewall_description:/^[a-zA-Z0-9][a-zA-Z0-9 .-_]{1,200}$/,
  },
  phonebook:{
    first_name:/^[a-zA-Z0-9][a-zA-Z0-9 .-_]{1,200}$/,
    last_name:/^[a-zA-Z0-9][a-zA-Z0-9 .-_]{1,200}$/,
    mobile:/^[0-9]{3,20}$/,
    phone_number:/^[0-9]{3,20}$/,
    company : /^[a-zA-Z0-9][a-zA-Z0-9 .-_]{1,200}$/,
    position : /^[a-zA-Z0-9][a-zA-Z0-9 .-_]{1,200}$/
  },
  system_record : {
    record_name:/^[a-zA-Z0-9][a-zA-Z0-9 .-_]{1,200}$/,
    description:/^[a-zA-Z0-9][a-zA-Z0-9 .-_]{1,200}$/,
  }
};


export default REGEXP;
