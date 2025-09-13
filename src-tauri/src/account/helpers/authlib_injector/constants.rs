pub static PRESET_AUTH_SERVERS: [&str; 2] = [
  "https://user.suesmc.ltd/api/yggdrasil",
  "https://skin.mualliance.ltd/api/yggdrasil",
];
pub static CLIENT_IDS: [(&str, &str); 1] = [("user.suesmc.ltd", "5")];
pub static SCOPE: &str =
  "openid offline_access Yggdrasil.PlayerProfiles.Select Yggdrasil.Server.Join";
pub static AUTHLIB_INJECTOR_JAR_NAME: &str = "authlib-injector.jar";
pub static TEXTURE_TYPES: [&str; 2] = ["SKIN", "CAPE"];
