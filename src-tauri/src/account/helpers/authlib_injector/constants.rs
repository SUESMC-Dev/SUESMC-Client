pub static PRESET_AUTH_SERVERS: [&str; 2] = [
  "https://user-dev.suesmc.ltd/api/yggdrasil",
  "https://skin.mualliance.ltd/api/yggdrasil",
];
pub static CLIENT_IDS: [(&str, &str); 2] =
  [("user-dev.suesmc.ltd", "2"), ("littleskin.cn", "1014")];
pub static SCOPE: &str =
  "openid offline_access Yggdrasil.PlayerProfiles.Select Yggdrasil.Server.Join";
pub static AUTHLIB_INJECTOR_JAR_NAME: &str = "authlib-injector.jar";
