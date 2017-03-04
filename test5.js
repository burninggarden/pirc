
global.req = require('req');

var ErroneousNicknameMessage = req('/lib/server/messages/erroneous-nickname');

var message = new ErroneousNicknameMessage();

var raw_message = ':irc.burninggarden.com 432 thrullcha 䠐䜆ᇫ���䑺㜴䶓ᬻс䘎फ़ֱἰ䫯䐡₢ೃǮኟᗯᰳ㤣ឃ㋹䖀⃂㦍ଊᙳ㷬䲠㦺䵾ٹௗ⑸㔡上䣺ᓮ㕢஺䍡ᡀᐨ⥨䣬݆���῎䇠㝥❂ӓἇ䶏㴴㊺㳈ᘾġە⟘䭷જ૓ತ׳఩ڄ⢚ᄗᖌ԰ڇ䥄䛻 㹯ⷔෞ䔸؇♻὘㚓䤞᎕೵ㄜ㌦⼜䰵ᛇ⸁ᪧ೏ :Erroneous Nickname';

message.setRawMessage(raw_message);
message.deserialize();

console.log(message.getUserDetails());
