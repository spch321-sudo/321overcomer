/* 321 共讀共學模組 xk321.js —— 朗讀（Azure 真人語音）、點句畫線、小智、美圖入口
   給沒有這些功能的 321 App 用（愛的關懷、學神院…）。ES5、不依賴任何框架；設定寫在 window.XK_CFG。
   功能與 321互動聖經一致：
   朗讀：整頁跟讀、逐句高亮、背景播放／鎖屏（單一 audio、Media Session、Wake Lock）、浮動控制列、三種聲音與語速、
         失敗改用裝置語音、多音字修正、括號出處／表情符號不唸、小智回答口語化。
   畫線：點句畫線、8 色、句數－／＋、整段、默想、儲存、問小智、做成美圖、朗讀這句、複製、分享、刪除；「我的畫線」清單。
   小智：全螢幕、markdown 美編、★收藏／↗分享／🖼做成美圖／🔊朗讀／✕刪除、範例問題、回答對象十種、回答長度、
         追問、長回答收合、截斷自動接續、字級。
   美圖：交給同頁的 GXU 美圖工作室（window.GXU）。 */
(function () {
'use strict';
if (window.XK) return;
var C = window.XK_CFG || {};
var SVC = { xz: 'https://xiaozhi-proxy.spch321.workers.dev', tts: 'https://azure-tts.spch321.workers.dev', model: 'claude-sonnet-4-6' };
var PACK = {"audT":"小智的回答對象","auds":"🧑 成人|🧒 青少年|🧸 兒童|🌱 慕道友|👴 長輩|👩‍👧 單親|🙋 單身|👨‍👩‍👧 父母|💑 夫妻|⛪ 牧者","audNow":"回答對象：{0}　▾","audSet":"小智會用「{0}」聽得懂的方式回答","audD_adult":"有深度，貼近工作、家庭與關係","audD_teen":"幽默風趣、不說教，用你的世界來比喻","audD_kid":"非常簡單好懂，像在聽故事","audD_seeker":"還沒信主也聽得懂，不說教，給實際的幫助","aud_adult":"【回答對象】成年讀者：口吻成熟、溫暖、真誠。","aud_teen":"【回答對象】青少年：像朋友聊天，幽默風趣，可以有一點梗，但不說教、不輕浮，也絕不拿神和聖經開玩笑。","aud_kid":"【回答對象】兒童（5–11 歲）：非常淺顯，短句，像說故事，一句只講一件事，不用艱深名詞。","aud_seeker":"【回答對象】慕道友（還沒信主的朋友）：從他的處境與疑問切入，再帶到經文；用最平常的話，不用「無己、作王、得勝、屬靈」等教會內部用語，必須用的詞立刻用生活說法解釋；誠實、尊重、不說教、不施壓、不要求現在就相信；清楚說出神是怎樣的神、耶穌為我們做了什麼；給一兩個這星期就能試的小步驟；禱告只當作「若你願意，可以這樣對神說」的邀請。","prayRule":"\n【禱告的寫法（一定要照做）】回答裡凡要寫禱告，那一段的小標題一律寫「憑信心禱告」，不要寫「為你禱告」「我為你禱告」或「一起禱告」。禱告前先用一句話邀請讀者自己開口，例如「請你憑信心，親口向主這樣禱告：」。禱告本身要用讀者的第一人稱，寫成讀者自己向神說的話；不要寫成小智替讀者禱告，不要出現「這位」「他／她」等第三人稱。禱告要簡短、真誠、帶著信心交託與感恩，結尾一律用「奉主耶穌的名禱告，阿們。」","fu_adult":"💑 用在婚姻~請把你剛才的回答，用在夫妻關係裡，給我一個具體做法。|🏠 用在家庭~請把你剛才的回答，用在和家人的相處上。|💼 用在職場~請把你剛才的回答，用在職場與同事相處上。|💗 我的內心~如果我心裡還在掙扎，你剛才的回答可以怎樣幫助我？|🙏 帶我禱告~請依你剛才的回答，帶我憑信心禱告。","fu_teen":"🏫 在學校~把你剛才說的，用在學校和同學身上會怎樣？|👫 跟朋友~跟朋友相處時，我可以怎麼做？|📱 手機網路~這和我用手機、上網有什麼關係？|💪 今天挑戰~給我一個今天就能做的小挑戰。|🙏 一起禱告~請用簡單的話帶我禱告。","fu_kid":"🏠 在家裡~在家裡我可以怎麼做？|🏫 在學校~在學校我可以怎麼做？|📖 說個故事~可以用一個小故事告訴我嗎？|🙏 小禱告~教我一句小小的禱告。","fu_seeker":"🤔 我還有疑問~我還是有些疑問，可以再用平常的話解釋嗎？|🚶 下一步~如果我想多了解，這個星期可以先做什麼？|💭 人生意義~這和我人生的意義有什麼關係？|🙏 試著禱告~如果我想試著和神說話，可以怎麼說？","bgs":"🌱 沒有信仰|☸️ 佛教|🏮 民間信仰|🕯️ 一貫道|☪️ 穆斯林|🔬 無神論","bgNames":"沒有信仰|佛教|民間信仰|一貫道|穆斯林|無神論者","bgT":"信仰背景：","lenT":"長度：","lens":"簡要|適中|詳細","lenSet":"小智接著用「{0}」重新回答","lenSet2":"已改為「{0}」，下次提問就會照這個長度回答","bgSet":"小智接著以「{0}」的角度重新回答","bgSet2":"已改為「{0}」，下次提問就會照這個角度回答","lenSys_brief":"\n【回答長度：簡要】只用3～5句話，約150字：先給核心答案，加上一句經文或一個比喻，最後一句禱告或一個小步驟；不用表格，不列長清單。","lenSys_full":"\n【回答長度：詳細】約800～1200字：說明經文脈絡、關鍵字詞、相關經文對照，連結321應用與本週操練，最後寫禱告；可使用短小的標題。","skbg_none":"\n【信仰背景：沒有信仰】不預設任何宗教詞彙，從對方的生活處境（壓力、關係、意義、不安）切入；一次只講一個重點，用日常說法，避免「無己、作王、得勝」等內部用語。\n共通原則：保持尊重與愛心，不嘲笑、不施壓、不要求對方立刻決定；誠實而溫和地說明基督信仰；先回答對方真正的問題，再連結到目前這個主題。","skbg_buddhism":"\n【信仰背景：佛教】不貶低佛陀與修行，不使用「拜偶像、迷信」等字眼；先肯定佛教對苦、無常、慈悲的重視，再說明聖經所說有位格的創造主、白白的恩典（不靠功德）、一世生命而非輪迴；不亂用佛教名詞。\n共通原則：保持尊重與愛心，不嘲笑、不施壓、不要求對方立刻決定；誠實而溫和地說明基督信仰；先回答對方真正的問題，再連結到目前這個主題。","skbg_folk":"\n【信仰背景：民間信仰】尊重孝心與祭祖的心意，先肯定聖經本來就教導孝敬父母；再說明敬拜歸給獨一真神；關心拜拜背後對平安與保佑的需要，並溫和說明祭祖與追思的不同；不要求對方立刻改變家人的習慣。\n共通原則：保持尊重與愛心，不嘲笑、不施壓、不要求對方立刻決定；誠實而溫和地說明基督信仰；先回答對方真正的問題，再連結到目前這個主題。","skbg_yiguandao":"\n【信仰背景：一貫道】尊重吃素與重視倫理的生活，不批評師尊、道場與儀式，也不自己推斷教義細節；從對「天」的敬畏談起，再溫和說明約翰福音14:6，耶穌是通往天父的道路。\n共通原則：保持尊重與愛心，不嘲笑、不施壓、不要求對方立刻決定；誠實而溫和地說明基督信仰；先回答對方真正的問題，再連結到目前這個主題。","skbg_muslim":"\n【信仰背景：穆斯林】以最大的敬意對談，不辱罵、不嘲諷、不施壓勸對方改教（考慮其家庭與社群的代價）；從獨一的神，以及亞伯拉罕、摩西、大衛談起；只引用聖經；清楚說明基督徒信的不是三個神；可比較「靠行為得救」與「靠恩典得救」；避免使用與豬肉、酒有關的比喻。\n共通原則：保持尊重與愛心，不嘲笑、不施壓、不要求對方立刻決定；誠實而溫和地說明基督信仰；先回答對方真正的問題，再連結到目前這個主題。","skbg_atheist":"\n【信仰背景：無神論者】尊重理性與證據，不說「只要信就好」，不把對方的想法稻草人化；誠實承認對苦難與宗教歷史錯誤的質疑很有分量，也承認哪些事無法用科學證明；從道德直覺、人生意義、宇宙秩序與耶穌的歷史記載談起；語氣平等、好奇、不防衛。\n共通原則：保持尊重與愛心，不嘲笑、不施壓、不要求對方立刻決定；誠實而溫和地說明基督信仰；先回答對方真正的問題，再連結到目前這個主題。","audNowS":"回答對象：{0} ▾","audD_elder":"尊敬溫和、慢慢說，句子清楚好懂","audD_single_parent":"先接住你的辛苦，給做得到的小步驟與盼望","audD_single":"真誠平等，不催婚，談身分、等待與使命","audD_parent":"貼近養兒育女的日常：溝通、管教、陪伴與禱告","audD_couple":"夫妻同行：溝通、饒恕、同心與一起禱告","audD_pastor":"同工口吻：牧養、講道預備、團隊與不倦怠","aud_elder":"【回答對象】回答對象：長輩（約65歲以上）。請用尊敬、溫和、慢慢說的口吻，像晚輩敬重地陪長輩讀經；句子清楚、不拐彎，不用網路用語和英文縮寫；比喻取自一生的閱歷（田地、家人、歲月、病痛、孫子、老街坊）。重點先講，分成短段落，不要太長。肯定他們一生走過的路與在主裡的忠心，不說教、不指責、不用「你應該」。可以談健康與軟弱、孤單、放下與交託、把信仰傳給下一代、永恆的盼望與感恩。結尾給一件簡單、容易做到的小事（一句禱告、打電話問候家人、數算一件感謝）。若提到身體不適、孤單或失去親人，要先溫柔安慰，並鼓勵他和家人、教會關懷同工聯絡。","fu_elder":"🩺 健康~請針對你剛才的回答，用簡單清楚、慢慢說的話說明怎麼把它用在身體的軟弱與健康，並給我一個這個星期做得到的具體小步驟。|🤍 孤單~請針對你剛才的回答，用簡單清楚、慢慢說的話說明怎麼把它用在孤單與思念，並給我一個這個星期做得到的具體小步驟。|👨‍👩‍👧‍👦 兒孫~請針對你剛才的回答，用簡單清楚、慢慢說的話說明怎麼把它用在和兒孫、家人的關係，並給我一個這個星期做得到的具體小步驟。|🕊️ 交託~請針對你剛才的回答，用簡單清楚、慢慢說的話說明怎麼把它用在放下心中的牽掛、交託給主，並給我一個這個星期做得到的具體小步驟。|🌅 盼望~請針對你剛才的回答，用簡單清楚、慢慢說的話說明怎麼把它用在永恆的盼望與感恩，並給我一個這個星期做得到的具體小步驟。|🙏 禱告~請把你剛才說的重點，用簡單的話寫成一段短短的禱告，讓我可以慢慢念給主聽。","aud_single_parent":"【回答對象】回答對象：單親爸爸或媽媽（一個人撐起一個家）。請先接住他的辛苦：他常常很累、有愧疚、有孤單，也有經濟、時間與教養的壓力。口吻溫暖、接納、不評斷，不追問過去的原因，不說「你應該再找個伴」，也不把單親說成缺憾。引用神的心意：神是孤兒的父、寡婦的伸冤者（詩篇68:5），祂與我們同在。再給盼望與實際：每一個小步驟都要在忙碌中做得到（五分鐘禱告、跟孩子的一個小儀式、開口向弟兄姊妹求助）。內容簡短、段落要短。結尾給一個這個星期做得到的小步驟。若他提到被暴力對待、疲憊到撐不下去或想傷害自己，要溫柔回應，並鼓勵他立刻聯絡信任的人、教會同工或專業協助。","fu_single_parent":"😮‍💨 疲累~請針對你剛才的回答，說明怎麼把它用在一個人撐家的疲累與內疚，並給我一個這個星期做得到的具體小步驟。|👧 孩子~請針對你剛才的回答，說明怎麼把它用在陪伴孩子與教養，並給我一個這個星期做得到的具體小步驟。|💰 經濟~請針對你剛才的回答，說明怎麼把它用在經濟與時間的壓力，並給我一個這個星期做得到的具體小步驟。|🤝 求助~請針對你剛才的回答，說明怎麼把它用在向弟兄姊妹或教會開口求助，並給我一個這個星期做得到的具體小步驟。|🌤️ 盼望~請針對你剛才的回答，說明怎麼把它用在在這個階段看見神的同在與盼望，並給我一個這個星期做得到的具體小步驟。|🙏 禱告~請把你剛才說的重點，寫成一段我在忙碌中五分鐘內就能禱告完的短禱告。","aud_single":"【回答對象】回答對象：單身的人（可能未婚、離婚、喪偶，或正在等候；不要預設他想結婚或不想結婚）。請不要把單身說成缺憾、「預備期」或「還沒到的人生」，也不要用催婚的口氣。談在基督裡的身分已經完整、被愛；談孤單時怎麼與神、與朋友、與團契連結；談時間、金錢與恩賜的運用與使命；談等待中的信靠；談感情與婚姻的智慧，以及在情感與身體上的聖潔，態度要尊重、不論斷。口吻真誠、平等、輕鬆。結尾給一個這個星期可以做的小步驟。若他提到孤單到想傷害自己，要溫柔回應並鼓勵他立刻聯絡信任的人或專業協助。","fu_single":"🫶 孤單~請針對你剛才的回答，說明怎麼把它用在孤單時怎麼與神、與朋友連結，並給我一個這個星期做得到的具體小步驟。|💝 身分~請針對你剛才的回答，說明怎麼把它用在我在基督裡的身分與價值，並給我一個這個星期做得到的具體小步驟。|⏳ 等待~請針對你剛才的回答，說明怎麼把它用在等待中的信靠，並給我一個這個星期做得到的具體小步驟。|💞 感情~請針對你剛才的回答，說明怎麼把它用在感情與交友的智慧，並給我一個這個星期做得到的具體小步驟。|🎯 使命~請針對你剛才的回答，說明怎麼把它用在把時間與恩賜用在神的使命上，並給我一個這個星期做得到的具體小步驟。|🙏 禱告~請把你剛才說的重點，寫成一段簡短、真誠的禱告，讓我可以拿來禱告。","aud_parent":"【回答對象】回答對象：正在養育孩子的父母（孩子可能從嬰幼兒到成年）。請站在父母的位置：他們常常疲累、擔心孩子、也常常內疚。口吻溫暖、貼近生活、不評斷；承認每個孩子與每個家庭都不同。談陪伴與榜樣、管教與恩典的平衡、親子溝通（怎麼聽、怎麼說）、為孩子禱告、夫妻同心、面對自己的軟弱與失敗；可用日常場景當比喻（吃飯、功課、手機、睡前）。結尾給一個這個星期可以做的具體小步驟（一句話、一個擁抱、一段睡前禱告）。若提到孩子遭受傷害、家庭暴力或孩子有自傷的念頭，要溫柔回應並鼓勵立刻尋求專業協助與信任的人。","fu_parent":"🗣️ 溝通~請針對你剛才的回答，說明怎麼把它用在跟孩子好好溝通（怎麼聽、怎麼說），並給我一個這個星期做得到的具體小步驟。|⚖️ 管教~請針對你剛才的回答，說明怎麼把它用在管教與恩典的平衡，並給我一個這個星期做得到的具體小步驟。|😔 內疚~請針對你剛才的回答，說明怎麼把它用在對孩子發脾氣或覺得虧欠的內疚，並給我一個這個星期做得到的具體小步驟。|💑 夫妻~請針對你剛才的回答，說明怎麼把它用在夫妻在教養上同心，並給我一個這個星期做得到的具體小步驟。|📖 信仰~請針對你剛才的回答，說明怎麼把它用在帶孩子認識神、一起親近神，並給我一個這個星期做得到的具體小步驟。|🙏 禱告~請把你剛才說的重點，寫成一段我可以為孩子祝福的短禱告。","aud_couple":"【回答對象】回答對象：夫妻（正在經營婚姻的丈夫與妻子，可能是新婚、有孩子的中年夫妻，或相伴多年的伴侶）。請站在夫妻同行的位置：口吻溫暖、真誠、不評斷，不偏袒任何一方；承認每段婚姻都有磨合、疲累與受傷的時候。談愛是決定與付出、彼此饒恕、傾聽與表達（怎麼說、怎麼聽）、尊重與同心、金錢與家務的分工、姻親與孩子的教養、一起禱告與一起讀經、在主裡成為一體；可用日常場景當比喻（飯桌、手牽手、吵完架之後、睡前）。結尾給一個這個星期兩個人就能一起做的具體小步驟（一句感謝的話、一段兩人的禱告、一次不看手機的散步）。不要教導妻子順服或丈夫掌權的單方面要求，要強調彼此相愛、彼此順服。若提到家庭暴力、外遇、對方的威脅或有自傷念頭，要溫柔回應，把安全放在第一位，並鼓勵立刻尋求專業協助與信任的人，不要勸人一味忍耐。","fu_couple":"🗣️ 溝通~請針對你剛才的回答，說明夫妻怎麼把它用在好好說、好好聽，並給我們一個這個星期兩個人做得到的具體小步驟。|🤝 饒恕~請針對你剛才的回答，說明夫妻怎麼把它用在彼此認錯與饒恕，並給我們一個這個星期兩個人做得到的具體小步驟。|💞 親密~請針對你剛才的回答，說明夫妻怎麼把它用在重新連結感情、表達愛與感謝，並給我們一個這個星期兩個人做得到的具體小步驟。|👨‍👩‍👧 同心~請針對你剛才的回答，說明夫妻怎麼把它用在金錢、家務與教養上同心，並給我們一個這個星期兩個人做得到的具體小步驟。|📖 同讀~請針對你剛才的回答，說明夫妻怎麼一起讀經、一起親近神，並給我們一個這個星期兩個人做得到的具體小步驟。|🙏 禱告~請把你剛才說的重點，寫成一段夫妻可以一起禱告的短禱告。","aud_pastor":"【回答對象】回答對象：牧者與傳道同工（教會的牧師、傳道人、小組長與事奉的同工）。請站在同工的位置：他們常常肩負許多人的重擔，自己也會疲累、孤單、被誤解或灰心。口吻尊重、平等、真誠，像同工之間彼此扶持，不說教、不居高臨下。可以有適度的深度：點出經文脈絡、原文語境與關鍵字詞的意思，談牧養羊群與生命建造、預備講道與教導、帶領小組與門徒訓練、團隊同心與衝突、面對批評與孤單、屬靈爭戰、自己的靈命與家庭，以及不倦怠的安息與依靠；也可提供講章或查經的切入點、段落與應用建議，但要提醒最後仍須自己在神面前領受。結尾給一個這個星期可以做的具體小步驟（一段安靜親近神的時間、一通關心的電話、一次向同工的坦誠分享）。若提到極度疲憊、憂鬱、想放棄或有自傷念頭，要溫柔回應，並鼓勵立刻尋求信任的同工、屬靈長輩與專業協助。","fu_pastor":"📖 講道~請針對你剛才的回答，提供一個可用於講道或查經的架構（三個要點與一個應用），並提醒我自己先在神面前領受。|🐑 牧養~請針對你剛才的回答，說明怎麼把它用在牧養羊群與關心個別的人，並給我一個這個星期做得到的具體小步驟。|🤝 團隊~請針對你剛才的回答，說明怎麼把它用在帶領團隊、同工同心與處理衝突，並給我一個這個星期做得到的具體小步驟。|🕊️ 安息~請針對你剛才的回答，說明怎麼把它用在自己的疲累與靈命保守，並給我一個這個星期做得到的具體小步驟。|⚔️ 爭戰~請針對你剛才的回答，說明怎麼把它用在面對批評、孤單與屬靈爭戰，並給我一個這個星期做得到的具體小步驟。|🙏 代禱~請把你剛才說的重點，寫成一段我可以為教會與同工代求的短禱告。","xzFormat":" 回答格式：需要並列或對照時可以用 markdown 表格；用簡短的小標題（####）與條列分段；請把最重要的一句用「> 」標成引言，那一句會被做成美圖。不要用程式碼區塊或念不出來的裝飾符號。若寫到禱告，結尾一律用「奉主耶穌的名禱告，阿們」。","xzExamples":"不知道問甚麼？看看範例","xzNote":"小智是陪伴的小幫手，不是聖靈，也不取代教會的牧養；重要的事請和屬靈長輩一起禱告尋求。","xzCont":"小智還在接著寫…","foldMore":"展開全文 ▾","foldLess":"收合 ▴","foldAll":"把所有長回答收合起來","foldAllB":"收合","foldedAll":"已收合所有長回答","foldNone":"目前沒有需要收合的回答","favB":"收藏","thinking":"小智思考中……","xzOffline":"目前沒有網路，小智暫時無法回答。","xzFail":"小智連不上","xzReplied":"小智回覆了","xzGoOn":"（剛才的回答因字數上限中斷了。請從中斷的地方直接接著寫完，不要重複前面的內容，也不要加開場白或說明。）","xz":"小智","xzNew":"新對話","xzPh":"想問小智什麼？","send":"送出","favSaved":"已收藏","delConfirm":"要清空這段對話嗎？","hlTitle":"這一句","hlColor":"顏色","hlSpan":"範圍","spanUnit":"{0} 句","spanP":"整段","hlNotePH":"寫下默想……","save":"儲存","makeCard":"做成美圖","readThis":"朗讀","copy":"複製","share":"分享","hlDel":"刪除畫線","spanIsP":"這一段已經整段畫起來了","spanDoneP":"已畫整段，共 {0} 句","copied":"已複製","close":"關閉","delHl":"刪除這條畫線？","myMarks":"我的畫線","noHl":"還沒有畫線。讀點心時點一下任何一句就能畫線。","hlAdded":"已畫線，再點一下可換色、寫默想、做美圖","xzCtxChip":"正在上：{0}","ttsFallback":"改用裝置內建語音","ttsErr":"這台裝置不支援朗讀","voiceN":"聲音 {0}","rateN":"語速 {0}","voiceB":"聲{0}","rateB":"速{0}","reading":"朗讀中","readAloud":"朗讀","nothingRead":"這個畫面沒有可以朗讀的文字","askXz":"問小智","saved":"已儲存","askAbout":"我畫了這一句：\n「{0}」\n——{1}\n{2}請幫我更明白，並告訴我怎樣在生活與服事中活出來。","myNote":"我的領受：{0}","noCard":"美圖工作室還沒載入，請稍後再試","xzHi":"平安！我是小智，{0}的屬靈同伴。可以問我經文的意思、怎麼活出來，或請我陪你禱告。","fsN":"字級 {0}/5","xzSysDef":"你是「小智」，國度321空中團契的屬靈同伴。以321理念回應：三個基礎（耶穌是我的榜樣、聖經是我的準則、聖靈是我的引導）、兩個核心（讓耶穌作王、讓耶穌得著一切的榮耀）、一個目的（建立屬神的體系）；焦點在耶穌，不在自己、別人或環境。深入淺出、善用比喻、條理清晰、溫暖真誠；引用聖經一律用和合本；回答簡明，一律用繁體中文。"};
var BK_ZH = "亞:撒迦利亞書|代上:歷代志上|代下:歷代志下|以弗所:以弗所書|以弗所書|以斯帖:以斯帖記|以斯帖記|以斯拉:以斯拉記|以斯拉記|以西結:以西結書|以西結書|以賽亞:以賽亞書|以賽亞書|伯:約伯記|但:但以理書|但以理:但以理書|但以理書|何:何西阿書|何西阿:何西阿書|何西阿書|使徒行傳|來:希伯來書|俄:俄巴底亞書|俄巴底亞:俄巴底亞書|俄巴底亞書|傳:傳道書|傳道書|出:出埃及記|出埃及:出埃及記|出埃及記|列王紀上|列王紀下|利:利未記|利未記|創:創世記|創世記|加:加拉太書|加拉太:加拉太書|加拉太書|可:馬可福音|哀:耶利米哀歌|哈:哈巴谷書|哈巴谷:哈巴谷書|哈巴谷書|哈該書|哥林多前:哥林多前書|哥林多前書|哥林多後:哥林多後書|哥林多後書|啟:啟示錄|啟示錄|士:士師記|士師記|多:提多書|太:馬太福音|尼:尼希米記|尼希米:尼希米記|尼希米記|希伯來:希伯來書|希伯來書|帖前:帖撒羅尼迦前書|帖後:帖撒羅尼迦後書|帖撒羅尼迦前:帖撒羅尼迦前書|帖撒羅尼迦前書|帖撒羅尼迦後:帖撒羅尼迦後書|帖撒羅尼迦後書|弗:以弗所書|彌:彌迦書|彌迦書|彼前:彼得前書|彼後:彼得後書|彼得前:彼得前書|彼得前書|彼得後:彼得後書|彼得後書|徒:使徒行傳|得:路得記|拉:以斯拉記|拿:約拿書|提前:提摩太前書|提多書|提後:提摩太後書|提摩太前:提摩太前書|提摩太前書|提摩太後:提摩太後書|提摩太後書|摩:阿摩司書|撒上:撒母耳記上|撒下:撒母耳記下|撒母耳記上|撒母耳記下|撒迦利亞:撒迦利亞書|撒迦利亞書|斯:以斯帖記|書:約書亞記|林前:哥林多前書|林後:哥林多後書|歌:雅歌|歌羅西:歌羅西書|歌羅西書|歷代志上|歷代志下|民:民數記|民數記|猶:猶大書|猶大書|王上:列王紀上|王下:列王紀下|珥:約珥書|瑪:瑪拉基書|瑪拉基:瑪拉基書|瑪拉基書|申:申命記|申命記|番:西番雅書|箴:箴言|箴言|約:約翰福音|約一:約翰一書|約三:約翰三書|約二:約翰二書|約亞:約書亞記|約伯記|約參:約翰三書|約壹:約翰一書|約拿書|約書亞記|約珥書|約翰一:約翰一書|約翰一書|約翰三:約翰三書|約翰三書|約翰二:約翰二書|約翰二書|約翰福音|約貳:約翰二書|結:以西結書|羅:羅馬書|羅馬書|耶:耶利米書|耶利米:耶利米書|耶利米哀歌|耶利米書|腓:腓立比書|腓利門:腓利門書|腓利門書|腓立比:腓立比書|腓立比書|西:歌羅西書|西番雅:西番雅書|西番雅書|詩:詩篇|詩篇|該:哈該書|賽:以賽亞書|路:路加福音|路加福音|路得記|那鴻書|門:腓利門書|阿摩司:阿摩司書|阿摩司書|雅:雅各書|雅各書|雅歌|馬可福音|馬太福音|鴻:那鴻書";
var KEY = (C.key || 'xk321') + '_xk1';
var BRAND = C.brand || '#1E5A86';

/* ---------- 小工具 ---------- */
function $(s, r) { return (r || document).querySelector(s); }
function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
function now() { return new Date().getTime(); }
function trim(s) { return String(s == null ? '' : s).replace(/^\s+|\s+$/g, ''); }
function fnv(str) { var h = 0x811c9dc5; for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0; } return h.toString(36); }
function T(k) { var s = PACK[k]; if (s == null) s = k; for (var i = 1; i < arguments.length; i++) s = String(s).split('{' + (i - 1) + '}').join(arguments[i]); return s; }
function toast(m) {
  var o = $('.xk-toast'); if (o) o.parentNode.removeChild(o);
  var d = document.createElement('div'); d.className = 'xk-toast'; d.textContent = m; document.body.appendChild(d);
  setTimeout(function () { if (d.parentNode) d.parentNode.removeChild(d); }, 2400);
}
function copyText(t, ok) {
  function fb() { try { var ta = document.createElement('textarea'); ta.value = t; ta.style.cssText = 'position:fixed;opacity:0;top:0'; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta); } catch (e) { } toast(T('copied')); if (ok) ok(); }
  try { if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(function () { toast(T('copied')); if (ok) ok(); }, fb); else fb(); } catch (e) { fb(); }
}
function shareText(t) { if (navigator.share) { navigator.share({ text: t }).catch(function () { }); return; } copyText(t); }
function ctxTitle() { try { return (C.ctx && C.ctx()) || ''; } catch (e) { return ''; } }
function appName() { return C.name || '321'; }

/* ---------- 狀態 ---------- */
var S = (function () {
  var d = { chat: [], fav: [], hl: {}, set: { aud: 'adult', alen: 'mid', skbg: 'none', voice: 0, rate: 0, fs: 2 } };
  try { var j = JSON.parse(localStorage.getItem(KEY) || 'null'); if (j) { for (var k in j) d[k] = j[k]; if (!d.set) d.set = {}; if (d.set.fs == null) d.set.fs = 2; if (d.set.voice == null) d.set.voice = 0; if (d.set.rate == null) d.set.rate = 0; } } catch (e) { }
  return d;
})();
function save() { try { if (S.chat.length > 60) S.chat = S.chat.slice(-60); localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { } }

/* ---------- 朗讀前處理：多音字、出處、表情符號 ---------- */
var TTS_FIX = [
  [/(與主|與神|與祂|與他|與你|與我|一起|彼此|和主|跟主|同心)同行/g, '$1同形'], [/重生/g, '蟲生'], [/重擔/g, '眾擔'], [/差遣/g, '拆遣'], [/差派/g, '拆派'], [/差役/g, '拆役'],
  [/背起/g, '揹起'], [/背負/g, '揹負'], [/背著/g, '揹著'], [/得著/g, '得着'], [/數算/g, '鼠算'], [/朝拜/g, '潮拜'], [/朝見/g, '潮見'],
  [/長老/g, '掌老'], [/長子/g, '掌子'], [/家長/g, '家掌'], [/長大/g, '掌大'], [/長執/g, '掌執'], [/長進/g, '掌進'], [/成長/g, '成掌'], [/生長/g, '生掌'], [/年長/g, '年掌'], [/長輩/g, '掌輩'], [/師長/g, '師掌'], [/兄長/g, '兄掌'],
  [/行為/g, '行圍'], [/為大/g, '圍大'], [/中了/g, '衷了'], [/中間/g, '衷間'], [/教會/g, '叫會'], [/傳道/g, '船道'], [/傳記/g, '賺記'],
  [/應當/g, '英當'], [/應許/g, '英許'], [/相應/g, '相映'], [/([組團校部首夫牧區會社])長/g, '$1掌'], [/長出/g, '掌出'], [/長者/g, '掌者'],
  [/行傳/g, '行賺'], [/數到/g, '鼠到'], [/數一數/g, '鼠一鼠'], [/(主|神|祂|祢|他|她)差(人|我|你|他|她|祂)/g, '$1拆$2'],
  [/看守/g, '刊守'], [/種子/g, '腫子'], [/年少/g, '年紹'], [/好施/g, '耗施'], [/組長/g, '組掌'], [/院長/g, '院掌'], [/會長/g, '會掌'], [/負責/g, '富責'], [/參加/g, '燦加'], [/塞車/g, '賽車']
];
var EMOJI_RE = /\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|\uD83E[\uDC00-\uDFFF]|[←-⇿⌀-⏿■-➿⬀-⯿☀-⛿︎️‍⃣〰〽™ℹ]/g;
var BKM = null;
function bookMap() { if (BKM) return BKM; var m = {}; BK_ZH.split('|').forEach(function (p) { var a = p.split(':'); m[a[0]] = a[1] || a[0]; }); return (BKM = m); }
function ttsRef(x) {
  return String(x || '').replace(/([^\s\d:：，。、；（）「」！？]{1,12})\s?(\d+)[:：](\d+)(?:\s*[–\-~～至]\s*(\d+))?/g, function (m, bk, c, v, v2) {
    var mp = bookMap(), pre = null, full = '';
    for (var k = 0; k < bk.length; k++) { var suf = bk.slice(k); if (mp[suf]) { pre = bk.slice(0, k); full = mp[suf]; break; } }
    if (pre === null) return m;
    var ps = /^詩篇$/.test(full); return pre + full + c + (ps ? '篇' : '章') + v + (v2 ? '到' + v2 : '') + '節';
  });
}
var REF_ONE = /^\s*(?:(?:參|见|見|另見|參看|參考)\s*)?(?:[1-3一二三]?\s?[一-鿿]{1,6})?\s*\d+(?:\s*[:：]\s*\d+(?:\s*[-–—~～至]\s*\d+)?)?(?:\s*[章節篇])?(?:\s*[-–—~～至]\s*\d+(?:\s*[:：]\s*\d+)?)?\s*$/;
function isRefParen(inner) { var ps = String(inner).split(/[；;、，,]/), ok = 0; for (var i = 0; i < ps.length; i++) { if (!trim(ps[i])) continue; if (!REF_ONE.test(ps[i])) return false; ok++; } return ok > 0; }
function dropRefParens(x) { return x.replace(/([，,]?\s*(?:參|見|see|cf\.?)\s*)?[（(]([^（）()]{1,80})[）)]/g, function (m, lead, inner) { return isRefParen(inner) ? '' : m; }); }
function ttsPrep(s) {
  var x = dropRefParens(String(s || '')).replace(/〔[^〕]*〕/g, '').replace(/\[[^\]]*\]/g, '').replace(EMOJI_RE, '');
  x = ttsRef(x);
  x = x.replace(/[「」『』（）()〔〕\[\]《》〈〉*#>`_~|]/g, '').replace(/[—－]{1,2}/g, '，').replace(/321/g, '三二一').replace(/920/g, '九二零').replace(/235/g, '二三五');
  TTS_FIX.forEach(function (f) { x = x.replace(f[0], f[1]); });
  return trim(x.replace(/[ \t]{2,}/g, ' '));
}

/* ---------- markdown（小智回答） ---------- */
function mdInline(s) { return esc(s).replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>').replace(/\*([^*\n]+)\*/g, '<i>$1</i>').replace(/`([^`]+)`/g, '$1'); }
function md(text) {
  var lines = String(text || '').replace(/\r/g, '').split('\n'), out = '', list = null, i = 0, para = [];
  function endPara() { if (para.length) { out += '<p>' + para.join('<br>') + '</p>'; para = []; } }
  function endList() { if (list) { out += '</' + list + '>'; list = null; } }
  while (i < lines.length) {
    var l = lines[i], m;
    if (/^\s*\|.*\|\s*$/.test(l) && i + 1 < lines.length && /^\s*\|?[\s:\-|]+\|?\s*$/.test(lines[i + 1]) && /-/.test(lines[i + 1])) {
      endPara(); endList();
      var rows = [], j = i;
      while (j < lines.length && /^\s*\|.*\|\s*$/.test(lines[j])) { if (j !== i + 1) rows.push(lines[j].replace(/^\s*\||\|\s*$/g, '').split('|')); j++; }
      out += '<table class="xk-tb">';
      rows.forEach(function (r, ri) { out += '<tr>'; r.forEach(function (c) { out += (ri === 0 ? '<th>' : '<td>') + mdInline(trim(c)) + (ri === 0 ? '</th>' : '</td>'); }); out += '</tr>'; });
      out += '</table>'; i = j; continue;
    }
    if ((m = /^\s*(#{1,6})\s+(.*)$/.exec(l))) { endPara(); endList(); out += '<h4>' + mdInline(m[2]) + '</h4>'; }
    else if ((m = /^\s*>\s?(.*)$/.exec(l))) { endPara(); endList(); out += '<blockquote>' + mdInline(m[1]) + '</blockquote>'; }
    else if ((m = /^\s*[-*・•]\s+(.*)$/.exec(l))) { endPara(); if (list !== 'ul') { endList(); out += '<ul>'; list = 'ul'; } out += '<li>' + mdInline(m[1]) + '</li>'; }
    else if ((m = /^\s*(\d+)[.、)]\s+(.*)$/.exec(l))) { endPara(); if (list !== 'ol') { endList(); out += '<ol>'; list = 'ol'; } out += '<li>' + mdInline(m[2]) + '</li>'; }
    else if (/^\s*(-{3,}|\*{3,})\s*$/.test(l)) { endPara(); endList(); out += '<hr>'; }
    else if (!trim(l)) { endPara(); endList(); }
    else { endList(); para.push(mdInline(l)); }
    i++;
  }
  endPara(); endList(); return out;
}
function mdStrip(t) {
  return String(t || '').replace(/\r/g, '').split('\n').map(function (l) {
    if (/^\s*\|?[\s:\-|]+\|?\s*$/.test(l) && /-/.test(l)) return '';
    l = l.replace(/^\s*#{1,6}\s+/, '').replace(/^\s*>\s?/, '').replace(/^\s*[-*•]\s+/, '・').replace(/\*\*([^*]+)\*\*/g, '$1').replace(/\*([^*\n]+)\*/g, '$1').replace(/`/g, '');
    if (/^\s*\|.*\|\s*$/.test(l)) l = l.replace(/^\s*\||\|\s*$/g, '').split('|').map(trim).join('　');
    return l;
  }).join('\n').replace(/\n{3,}/g, '\n\n');
}
function mdSpeak(t) {
  return trim(mdStrip(t).replace(/(\d)️?⃣/g, '$1. ').replace(EMOJI_RE, '').replace(/^・/gm, '').replace(/奉主耶穌的名禱告[，,]?\s*阿們/g, '奉主耶穌的名禱告，阿們'));
}

/* ---------- 朗讀引擎 ---------- */
var SILENT_WAV = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAgD4AAAB9AAACABAAZGF0YQAAAAA=';
var VOICES = ['zh-TW-YunJheNeural', 'zh-CN-Yunfan:DragonHDLatestNeural', 'zh-CN-Xiaochen:DragonHDLatestNeural'];
var RATES = ['-10%', '+0%', '+15%', '+30%'];
var spk = { on: false, items: [], idx: 0, native: false, token: 0, key: '', title: '', cache: {}, paused: false };
var ttsEl = null, ttsUnlocked = false, wakeLock = null, curSentEl = null;
function ttsAudio() { if (!ttsEl) { ttsEl = new Audio(); ttsEl.preload = 'auto'; try { ttsEl.setAttribute('playsinline', ''); } catch (e) { } ttsEl.onended = function () { if (spk.on && !spk.native) nextItem(); }; ttsEl.onerror = function () { if (spk.on && !spk.native) fallbackNative(); }; } return ttsEl; }
function ttsUnlock() { if (ttsUnlocked) return; try { var a = ttsAudio(); a.src = SILENT_WAV; var p = a.play(); if (p && p.then) p.then(function () { ttsUnlocked = true; }, function () { }); else ttsUnlocked = true; } catch (e) { } }
function voiceName() { return VOICES[S.set.voice] || VOICES[0]; }
function rateAttr() { return RATES[S.set.rate] || '+0%'; }
function ttsFetch(text, cb) {
  var ck = S.set.voice + '|' + S.set.rate + '|' + text;
  if (spk.cache[ck]) { cb(spk.cache[ck]); return; }
  if (navigator.onLine === false) { cb(null); return; }
  var x = new XMLHttpRequest(); x.open('POST', SVC.tts, true); x.setRequestHeader('Content-Type', 'application/json'); x.responseType = 'blob'; x.timeout = 25000;
  x.onload = function () { if (x.status >= 200 && x.status < 300 && x.response && x.response.size > 200) { var u = URL.createObjectURL(x.response); spk.cache[ck] = u; cb(u); } else cb(null); };
  x.onerror = x.ontimeout = function () { cb(null); };
  try { x.send(JSON.stringify({ voice: voiceName(), rate: rateAttr(), sil: 140, silc: 140, sile: 260, text: text })); } catch (e) { cb(null); }
}
function mark(el) {
  if (curSentEl) { try { curSentEl.classList.remove('xk-reading'); } catch (e) { } curSentEl = null; }
  if (el) { curSentEl = el; el.classList.add('xk-reading'); try { var r = el.getBoundingClientRect(); if (r.top < 90 || r.bottom > window.innerHeight - 140) el.scrollIntoView({ block: 'center', behavior: 'smooth' }); } catch (e) { } }
}
function setMedia() {
  try {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({ title: spk.title || appName(), artist: appName(), album: '國度321空中團契' });
      navigator.mediaSession.setActionHandler('play', function () { toggleSpeak(); });
      navigator.mediaSession.setActionHandler('pause', function () { toggleSpeak(); });
      navigator.mediaSession.setActionHandler('nexttrack', function () { skip(1); });
      navigator.mediaSession.setActionHandler('previoustrack', function () { skip(-1); });
    }
  } catch (e) { }
}
function lockOn() { try { if (navigator.wakeLock && !wakeLock) navigator.wakeLock.request('screen').then(function (l) { wakeLock = l; l.addEventListener('release', function () { wakeLock = null; }); }, function () { }); } catch (e) { } }
function lockOff() { try { if (wakeLock) { wakeLock.release(); wakeLock = null; } } catch (e) { } }
function paintBar() {
  var b = $('#xkBar');
  if (!spk.on) { if (b) b.parentNode.removeChild(b); paintBtns(); return; }
  if (!b) {
    b = document.createElement('div'); b.id = 'xkBar'; b.className = 'xk-bar';
    b.innerHTML = '<button data-x="prev" aria-label="prev">⏮</button><button data-x="play" aria-label="play">⏸</button><button data-x="next" aria-label="next">⏭</button><button data-x="stop" aria-label="stop">⏹</button><span class="t"></span><button data-x="voice" class="w"></button><button data-x="rate" class="w"></button>';
    document.body.appendChild(b);
    b.onclick = function (e) {
      var n = e.target.closest ? e.target.closest('button') : null; if (!n) return; var a = n.getAttribute('data-x');
      if (a === 'play') toggleSpeak(); else if (a === 'stop') stopSpeak(); else if (a === 'next') skip(1); else if (a === 'prev') skip(-1);
      else if (a === 'voice') { S.set.voice = (S.set.voice + 1) % VOICES.length; save(); toast(T('voiceN', S.set.voice + 1)); restartItem(); }
      else if (a === 'rate') { S.set.rate = (S.set.rate + 1) % RATES.length; save(); toast(T('rateN', RATES[S.set.rate])); restartItem(); }
    };
  }
  b.querySelector('[data-x=play]').textContent = spk.paused ? '▶' : '⏸';
  b.querySelector('.t').textContent = (spk.title ? spk.title + '　' : '') + (spk.items.length > 1 ? (spk.idx + 1) + '/' + spk.items.length : '');
  b.querySelector('[data-x=voice]').textContent = T('voiceB', S.set.voice + 1);
  b.querySelector('[data-x=rate]').textContent = T('rateB', RATES[S.set.rate]);
  paintBtns();
}
function paintBtns() {
  $$('[data-xk-say]').forEach(function (b) { var on = spk.on && spk.key === b.getAttribute('data-xk-say'); b.classList.toggle('on', on); if (b.getAttribute('data-xk-lab') !== '0') b.textContent = on ? (spk.paused ? '▶' : '⏸') + (b.getAttribute('data-xk-lab') === 'full' ? ' ' + T('reading') : '') : (b.getAttribute('data-xk-lab') === 'full' ? '🔊 ' + T('readAloud') : '🔊'); });
  var f = $('#xkFabRead'); if (f) f.classList.toggle('on', spk.on && spk.key === 'page');
}
function stopSpeak() {
  spk.token++; spk.on = false; spk.paused = false; spk.items = []; mark(null);
  try { if (ttsEl) { ttsEl.pause(); } } catch (e) { } try { if (window.speechSynthesis) speechSynthesis.cancel(); } catch (e) { }
  lockOff(); try { if ('mediaSession' in navigator) navigator.mediaSession.playbackState = 'none'; } catch (e) { } paintBar();
}
function startSpeak(items, key, title, from) {
  stopSpeak(); ttsUnlock();
  items = items.filter(function (it) { return it && trim(it.text); }); if (!items.length) { toast(T('nothingRead')); return; }
  spk.on = true; spk.items = items; spk.idx = from || 0; spk.key = key; spk.title = title || ''; spk.native = false; spk.paused = false; spk.token++;
  lockOn(); setMedia(); paintBar(); playItem();
}
function playItem() {
  var tk = spk.token; if (!spk.on) return;
  if (spk.idx >= spk.items.length) { stopSpeak(); return; }
  var it = spk.items[spk.idx]; mark(it.el); paintBar();
  var text = ttsPrep(it.text);
  if (!text) { nextItem(); return; }
  if (spk.native) { speakNative(text, tk); return; }
  ttsFetch(text, function (u) {
    if (tk !== spk.token || !spk.on) return;
    if (!u) { spk.native = true; toast(T('ttsFallback')); speakNative(text, tk); return; }
    try { var a = ttsAudio(); a.src = u; var p = a.play(); if (p && p.catch) p.catch(function () { if (tk === spk.token) { spk.native = true; speakNative(text, tk); } }); try { navigator.mediaSession.playbackState = 'playing'; } catch (e) { } } catch (e) { spk.native = true; speakNative(text, tk); }
    var nx = spk.items[spk.idx + 1]; if (nx) { var nt = ttsPrep(nx.text); if (nt) ttsFetch(nt, function () { }); }
  });
}
function speakNative(text, tk) {
  if (!window.speechSynthesis) { stopSpeak(); toast(T('ttsErr')); return; }
  try {
    speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(text); u.lang = 'zh-TW'; u.rate = 1 + (S.set.rate - 1) * 0.15;
    var vs = speechSynthesis.getVoices() || [], v = null; for (var i = 0; i < vs.length; i++) if (/zh[-_]TW/i.test(vs[i].lang)) { v = vs[i]; break; } if (!v) for (i = 0; i < vs.length; i++) if (/^zh/i.test(vs[i].lang)) { v = vs[i]; break; }
    if (v) u.voice = v;
    u.onend = function () { if (tk === spk.token && spk.on) nextItem(); }; u.onerror = function () { if (tk === spk.token && spk.on) nextItem(); };
    speechSynthesis.speak(u);
  } catch (e) { stopSpeak(); }
}
function fallbackNative() { var tk = spk.token; spk.native = true; var it = spk.items[spk.idx]; if (it) speakNative(ttsPrep(it.text), tk); }
function nextItem() { if (!spk.on) return; spk.idx++; playItem(); }
function skip(d) { if (!spk.on) return; var n = spk.idx + d; if (n < 0) n = 0; if (n >= spk.items.length) { stopSpeak(); return; } spk.token++; try { ttsAudio().pause(); if (window.speechSynthesis) speechSynthesis.cancel(); } catch (e) { } spk.idx = n; playItem(); }
function restartItem() { if (!spk.on) return; spk.token++; try { ttsAudio().pause(); if (window.speechSynthesis) speechSynthesis.cancel(); } catch (e) { } playItem(); }
function toggleSpeak() {
  if (!spk.on) return;
  spk.paused = !spk.paused;
  try {
    if (spk.native) { if (spk.paused) speechSynthesis.pause(); else speechSynthesis.resume(); }
    else { var a = ttsAudio(); if (spk.paused) a.pause(); else a.play(); }
    navigator.mediaSession.playbackState = spk.paused ? 'paused' : 'playing';
  } catch (e) { }
  paintBar();
}
/* 對外：朗讀一段文字（單鍵切換）／朗讀整頁 */
function sayText(text, key, title, el) {
  if (spk.on && spk.key === key) { stopSpeak(); return; }
  var parts = String(text || '').split(/\n+/).filter(function (x) { return trim(x); });
  var items = []; parts.forEach(function (p, i) { items.push({ text: p, el: parts.length === 1 ? el : null }); });
  startSpeak(items, key, title, 0);
}
document.addEventListener('visibilitychange', function () { if (!document.hidden && spk.on && !wakeLock && !spk.paused) lockOn(); });

/* ---------- 逐句畫線 ---------- */
var HL_COLORS = ['gold', 'green', 'blue', 'pink', 'purple', 'maroon', 'brown', 'charcoal'];
var HL_SW = { gold: '#E0B040', green: '#5AAE6A', blue: '#5B8DD6', pink: '#E88AA0', purple: '#A47FCB', maroon: '#8C4A4A', brown: '#9A6B3E', charcoal: '#555B5E' };
var HL_BG = { gold: 'rgba(224,176,64,.38)', green: 'rgba(90,174,106,.32)', blue: 'rgba(91,141,214,.30)', pink: 'rgba(232,138,160,.34)', purple: 'rgba(164,127,203,.32)', maroon: 'rgba(140,74,74,.28)', brown: 'rgba(154,107,62,.30)', charcoal: 'rgba(85,91,94,.24)' };
var SENT_END = /[。！？!?；;]/, CLOSERS = '」』）)”’】》〉';
function splitGroups(el) {
  var kids = Array.prototype.slice.call(el.childNodes), groups = [[]];
  kids.forEach(function (node) {
    if (node.nodeType === 3) {
      var text = node.textContent, buf = '';
      for (var i = 0; i < text.length; i++) {
        buf += text[i];
        if (SENT_END.test(text[i]) || text[i] === '\n') {
          var j = i + 1; while (j < text.length && CLOSERS.indexOf(text[j]) >= 0) { buf += text[j]; j++; }
          if (text[i] !== '\n') while (j < text.length && text[j] === '\n') { buf += text[j]; j++; }
          i = j - 1; groups[groups.length - 1].push(document.createTextNode(buf)); buf = ''; groups.push([]);
        }
      }
      if (buf) groups[groups.length - 1].push(document.createTextNode(buf));
    } else groups[groups.length - 1].push(node);
  });
  return groups.filter(function (g) { var t = ''; g.forEach(function (n) { t += n.textContent || ''; }); return trim(t) || g.length > 1; });
}
function blockOk(b) {
  if (b.getAttribute('data-xk')) return false;
  if (b.closest && b.closest('textarea,button,input,select,.xk-sheet,.xk-chat,.xk-marks,.xk-bar,[data-xk-skip],.xk-skip,#xz,.gxsmask,#gxuPanel')) return false;
  if (b.querySelector('textarea,input,select,button')) return false;
  if (trim(b.textContent).length < 4) return false;
  return true;
}
function blockKey(b) { return fnv(trim(b.textContent).replace(/\s+/g, '').slice(0, 60)); }
function wrapBlock(b) {
  var groups = splitGroups(b); if (!groups.length) return;
  var bk = blockKey(b); b.setAttribute('data-xk', bk); b.classList.add('xk-blk');
  while (b.firstChild) b.removeChild(b.firstChild);
  groups.forEach(function (nodes, i) {
    var sp = document.createElement('span'); sp.className = 'xks'; sp.setAttribute('data-k', bk + '.' + i); sp.setAttribute('data-i', i);
    nodes.forEach(function (n) { sp.appendChild(n); }); b.appendChild(sp);
  });
  paintBlock(b);
}
function paintBlock(b) {
  var spans = $$('.xks', b), cover = {};
  spans.forEach(function (s, i) { var h = S.hl[s.getAttribute('data-k')]; if (h) { var n = Math.max(1, +h.sp || 1); for (var d = 0; d < n && i + d < spans.length; d++) cover[i + d] = h; } });
  spans.forEach(function (s, i) { var h = cover[i]; if (h) { s.setAttribute('data-hl', h.c); } else s.removeAttribute('data-hl'); });
  $$('.xk-note', b.parentNode).forEach(function (n) { if (n.getAttribute('data-for') === b.getAttribute('data-xk')) n.parentNode.removeChild(n); });
  var last = null; spans.forEach(function (s) { var h = S.hl[s.getAttribute('data-k')]; if (h && h.n) { last = last || b; var d = document.createElement('div'); d.className = 'xk-note'; d.setAttribute('data-for', b.getAttribute('data-xk')); d.setAttribute('data-k', s.getAttribute('data-k')); d.textContent = '📝 ' + h.n; last.parentNode.insertBefore(d, last.nextSibling); last = d; } });
}
function scan() {
  var sel = C.blocks; if (!sel) return;
  var root = (typeof C.root === 'string' ? $(C.root) : C.root) || document.body; if (!root) return;
  var list = $$(sel, root);
  list.forEach(function (b) {
    if (b.getAttribute('data-xk')) { return; }
    if (!blockOk(b)) return;
    // 不處理含有其他目標區塊的容器
    if (b.querySelector(sel)) return;
    wrapBlock(b);
  });
}
var scanT = 0, scanning = false;
function schedScan() { if (scanning) return; clearTimeout(scanT); scanT = setTimeout(function () { scanning = true; try { scan(); } catch (e) { } scanning = false; ensureButtons(); }, 180); }
function sentOf(k) { return $('.xks[data-k="' + k + '"]'); }
function blockOf(s) { return s && s.parentNode; }
function spansIn(b) { return $$('.xks', b); }
function headOf(s) {
  var b = blockOf(s), sp = spansIn(b), i = sp.indexOf(s);
  for (var j = i; j >= 0; j--) { var h = S.hl[sp[j].getAttribute('data-k')]; if (h && j + Math.max(1, +h.sp || 1) > i) return { span: sp[j], h: h, k: sp[j].getAttribute('data-k') }; }
  return null;
}
function hlText(head) {
  var b = blockOf(head.span), sp = spansIn(b), i = sp.indexOf(head.span), n = Math.max(1, +head.h.sp || 1), t = '';
  for (var d = 0; d < n && i + d < sp.length; d++) t += sp[d + i].textContent;
  return trim(t.replace(/\s+/g, ' '));
}
function onSentTap(s) {
  var hd = headOf(s);
  if (hd) { openSheet(hd); return; }
  var k = s.getAttribute('data-k'); var t = trim(s.textContent.replace(/\s+/g, ' '));
  S.hl[k] = { t: t, ref: ctxTitle(), c: 'gold', sp: 1, n: '', at: now() }; save(); paintBlock(blockOf(s)); toast(T('hlAdded'));
}
var cur = null;
function closeSheet() { var m = $('.xk-sheet'); if (m) m.parentNode.removeChild(m); cur = null; }
function openSheet(hd) {
  closeSheet(); cur = hd; var h = hd.h;
  var m = document.createElement('div'); m.className = 'xk-sheet'; 
  var sw = ''; HL_COLORS.forEach(function (c) { sw += '<button class="xk-sw' + (h.c === c ? ' on' : '') + '" data-a="c" data-c="' + c + '" style="background:' + HL_SW[c] + '" aria-label="' + c + '"></button>'; });
  m.innerHTML = '<div class="xk-card"><div class="xk-st">' + esc(T('hlTitle')) + '<span id="xkRef">' + esc(h.ref || ctxTitle()) + '</span></div>' +
    '<div class="xk-quote" id="xkQuote">' + esc(hlText(hd)) + '</div>' +
    '<div class="xk-row"><span class="xk-lab">' + esc(T('hlColor')) + '</span><div class="xk-sws">' + sw + '</div></div>' +
    '<div class="xk-row"><span class="xk-lab">' + esc(T('hlSpan')) + '</span><div class="xk-span"><button data-a="sp" data-d="-1">－</button><b id="xkNum">' + esc(T('spanUnit', h.sp || 1)) + '</b><button data-a="sp" data-d="1">＋</button><button data-a="sp" data-d="p" class="w">' + esc(T('spanP')) + '</button></div></div>' +
    '<textarea class="xk-ta" id="xkNote" placeholder="' + esc(T('hlNotePH')) + '">' + esc(h.n || '') + '</textarea>' +
    '<div class="xk-acts"><button class="pri" data-a="save">' + esc(T('save')) + '</button><button data-a="ask">💬 ' + esc(T('askXz')) + '</button></div>' +
    '<div class="xk-acts2"><button class="gold" data-a="card">🖼 ' + esc(T('makeCard')) + '</button><button data-a="read">🔊 ' + esc(T('readThis')) + '</button><button data-a="copy">⧉ ' + esc(T('copy')) + '</button><button data-a="share">↗ ' + esc(T('share')) + '</button><button class="bad" data-a="del">' + esc(T('hlDel')) + '</button><button data-a="close">' + esc(T('close')) + '</button></div></div>';
  document.body.appendChild(m);
  m.onclick = function (e) {
    if (e.target === m) { grabNote(); closeSheet(); return; }
    var n = e.target.closest ? e.target.closest('button') : null; if (!n || !cur) return; var a = n.getAttribute('data-a');
    if (a === 'c') { cur.h.c = n.getAttribute('data-c'); save(); paintBlock(blockOf(cur.span)); $$('.xk-sw', m).forEach(function (x) { x.classList.toggle('on', x === n); }); }
    else if (a === 'sp') spanSet(n.getAttribute('data-d'));
    else if (a === 'save') { grabNote(); closeSheet(); paintBlock(blockOf(hd.span)); toast(T('saved')); }
    else if (a === 'ask') { grabNote(); var t = hlText(cur), r = cur.h.ref || ctxTitle(), nn = cur.h.n; closeSheet(); openChat(T('askAbout', t, r, nn ? T('myNote', nn) + '\n' : ''), { t: t, ref: r }); }
    else if (a === 'card') { grabNote(); var o = { text: hlText(cur), ref: cur.h.ref || ctxTitle() || appName(), note: cur.h.n || '', plain: true }; closeSheet(); openCard(o); }
    else if (a === 'read') { var t2 = hlText(cur), sp0 = cur.span; closeSheet(); sayText(t2, 'hl:' + cur.k, cur.h.ref || appName(), null); }
    else if (a === 'copy') { grabNote(); copyText(shareOf(cur)); }
    else if (a === 'share') { grabNote(); shareText(shareOf(cur)); }
    else if (a === 'del') { if (confirm(T('delHl'))) { var b = blockOf(cur.span); delete S.hl[cur.k]; save(); closeSheet(); paintBlock(b); } }
    else if (a === 'close') { grabNote(); closeSheet(); }
  };
}
function shareOf(hd) { return '「' + hlText(hd) + '」\n—— ' + (hd.h.ref || ctxTitle() || appName()) + (hd.h.n ? '\n\n' + hd.h.n : '') + '\n\n' + appName() + ' · 國度321空中團契'; }
function grabNote() { var ta = $('#xkNote'); if (ta && cur) { cur.h.n = trim(ta.value); save(); } }
function spanSet(d) {
  if (!cur) return; var b = blockOf(cur.span), sp = spansIn(b), i = sp.indexOf(cur.span), maxN = sp.length - i, n;
  if (d === 'p') { n = maxN; toast(n === (cur.h.sp || 1) ? T('spanIsP') : T('spanDoneP', n)); } else n = (cur.h.sp || 1) + (+d);
  n = Math.max(1, Math.min(maxN, n)); cur.h.sp = n; cur.h.t = hlText(cur); save(); paintBlock(b);
  var q = $('#xkQuote'); if (q) q.textContent = cur.h.t; var u = $('#xkNum'); if (u) u.textContent = T('spanUnit', n);
}
function openCard(o) {
  if (window.GXU && window.GXU.open) { try { window.GXU.open(o); return; } catch (e) { } }
  toast(T('noCard'));
}
function openMarks() {
  closeMarks(); var m = document.createElement('div'); m.className = 'xk-marks';
  var arr = []; for (var k in S.hl) arr.push([k, S.hl[k]]); arr.sort(function (a, b) { return (b[1].at || 0) - (a[1].at || 0); });
  var h = '<div class="xk-mh"><b>🖍 ' + esc(T('myMarks')) + '</b><button data-a="x" aria-label="close">✕</button></div><div class="xk-mb">';
  if (!arr.length) h += '<div class="xk-empty">' + esc(T('noHl')) + '</div>';
  arr.forEach(function (p) { var x = p[1]; h += '<div class="xk-mi" data-c="' + esc(x.c) + '"><div class="q">' + esc(x.t) + '</div><div class="r">' + esc(x.ref || '') + '</div>' + (x.n ? '<div class="n">📝 ' + esc(x.n) + '</div>' : '') + '<div class="a"><button data-a="card" data-k="' + esc(p[0]) + '">🖼 ' + esc(T('makeCard')) + '</button><button data-a="ask" data-k="' + esc(p[0]) + '">💬 ' + esc(T('askXz')) + '</button><button data-a="del" data-k="' + esc(p[0]) + '">✕</button></div></div>'; });
  m.innerHTML = h + '</div>'; document.body.appendChild(m);
  m.onclick = function (e) {
    var n = e.target.closest ? e.target.closest('button') : null; if (!n) return; var a = n.getAttribute('data-a'), k = n.getAttribute('data-k'), x = S.hl[k];
    if (a === 'x') closeMarks();
    else if (a === 'card' && x) { closeMarks(); openCard({ text: x.t, ref: x.ref || appName(), note: x.n || '', plain: true }); }
    else if (a === 'ask' && x) { closeMarks(); openChat(T('askAbout', x.t, x.ref || '', x.n ? T('myNote', x.n) + '\n' : ''), { t: x.t, ref: x.ref }); }
    else if (a === 'del' && x) { if (confirm(T('delHl'))) { delete S.hl[k]; save(); $$('.xk-blk').forEach(paintBlock); openMarks(); } }
  };
}
function closeMarks() { var m = $('.xk-marks'); if (m) m.parentNode.removeChild(m); }

/* ---------- 小智 ---------- */
var AUD_KEYS = ['adult', 'teen', 'kid', 'seeker', 'elder', 'single_parent', 'single', 'parent', 'couple', 'pastor'];
var LEN_KEYS = ['brief', 'mid', 'full'], BG_KEYS = ['none', 'buddhism', 'folk', 'yiguandao', 'muslim', 'atheist'];
var XZ = { open: false, opt: false, audOpen: false, qsOpen: false, ctx: null }, chatBusy = false, chatCtx = null;
var FS = [15, 17, 19, 22, 25];
function audIdx() { var i = AUD_KEYS.indexOf(S.set.aud); return i < 0 ? 0 : i; }
function lenIdx() { var i = LEN_KEYS.indexOf(S.set.alen); return i < 0 ? 1 : i; }
function bgIdx() { var i = BG_KEYS.indexOf(S.set.skbg); return i < 0 ? 0 : i; }
function audSys() { return T('aud_' + AUD_KEYS[audIdx()]); }
function lenSys() { var k = LEN_KEYS[lenIdx()]; return k === 'mid' ? '' : T('lenSys_' + k); }
function bgSys() { return AUD_KEYS[audIdx()] === 'seeker' ? T('skbg_' + BG_KEYS[bgIdx()]) : ''; }
function sysPrompt() {
  var s = (C.sys || T('xzSysDef')) + (XZ.ctx ? '\n\n' + XZ.ctx : '');
  var ct = ctxTitle(); if (ct && !XZ.ctx) s += '\n\n讀者目前在：' + ct + '。';
  return s + T('xzFormat') + '\n' + audSys() + bgSys() + lenSys() + T('prayRule');
}
function extractReply(d) { if (!d) return ''; if (typeof d === 'string') return d; var t = ''; if (d.content && d.content.length) { for (var i = 0; i < d.content.length; i++) if (d.content[i].type === 'text' || d.content[i].text) t += d.content[i].text || ''; if (t) return t; } return d.reply || d.text || d.message || (d.choices && d.choices[0] && d.choices[0].message ? d.choices[0].message.content : '') || ''; }
function isFav(t) { for (var i = 0; i < S.fav.length; i++) if (S.fav[i].text === t) return true; return false; }
function msgLong(m) { return m && m.role !== 'user' && mdStrip(m.text || '').length > 200; }
function foldOld() { for (var k = 0; k < S.chat.length - 1; k++) if (msgLong(S.chat[k])) S.chat[k].fold = true; }
function foldAll() { var n = 0; S.chat.forEach(function (m) { if (msgLong(m) && !m.fold) { m.fold = true; n++; } }); save(); paintChat(); toast(T(n ? 'foldedAll' : 'foldNone')); }
function cutOff(d, t) { var sr = d && (d.stop_reason || d.finish_reason || (d.choices && d.choices[0] && d.choices[0].finish_reason)); if (sr) return sr === 'max_tokens' || sr === 'length'; t = trim(mdStrip(t)); return t.length > 300 && !/[。！？.!?」』”)）阿們men]$/.test(t); }
function joinCont(a, b) {
  b = String(b).replace(/^\s*(好的|好|接續|繼續|继续|Continuing)[，,:：。.!！]?\s*/, '');
  for (var n = Math.min(80, a.length, b.length); n >= 6; n--) if (a.slice(-n) === b.slice(0, n)) return a + b.slice(n);
  var nl = /^(#|>|-|\*|\d+[.、]|\|)/.test(trim(b)) && !/\n$/.test(a); return a + (nl ? '\n\n' : '') + b;
}
function cardText(t) {
  var LIM = 140, raw = String(t || ''), m = raw.match(/^> ?(.+)$/m);
  if (m) { var q = mdStrip(m[1]); if (q.length >= 12 && q.length <= LIM + 60) return q; }
  var body = []; mdStrip(raw).split('\n').forEach(function (l) { if (trim(l) && !/^・/.test(trim(l))) body.push(trim(l)); });
  var b = body.join(''); if (b.length <= LIM) return b; var cut = b.slice(0, LIM), k = Math.max(cut.lastIndexOf('。'), cut.lastIndexOf('！')); return (k > 40 ? cut.slice(0, k + 1) : cut) + '…';
}
function optChips(arr, curI, act) { var h = ''; arr.forEach(function (l, i) { h += '<button class="chip' + (i === curI ? ' on' : '') + '" data-a="' + act + '" data-i="' + i + '">' + esc(l) + '</button>'; }); return h; }
function optsHtml() {
  var L = T('auds').split('|'), ln = T('lens').split('|'), bn = T('bgNames').split('|'), sk = AUD_KEYS[audIdx()] === 'seeker';
  var nm = L[audIdx()].replace(/^\S+\s/, ''), sum = nm + '　·　' + (sk ? bn[bgIdx()] + '　·　' : '') + ln[lenIdx()];
  var h = '<button class="opt-sum" data-a="opt"><span>⚙️ ' + esc(L[audIdx()].split(' ')[0]) + ' ' + esc(sum) + '</span><b>' + (XZ.opt ? '▲' : '▼') + '</b></button>';
  if (!XZ.opt) return h;
  h += '<div class="opt-body"><div class="optrow"><button class="tg' + (XZ.audOpen ? ' on' : '') + '" data-a="audtog">' + esc(L[audIdx()].split(' ')[0]) + ' ' + esc(T('audNowS', nm)) + '</button><button class="tg' + (XZ.qsOpen ? ' on' : '') + '" data-a="qstog">💡 ' + esc(T('xzExamples')) + '</button></div>';
  if (XZ.audOpen) h += '<div class="audgrid">' + optChips(L, audIdx(), 'aud') + '</div><div class="xk-sm" style="margin:6px 0 8px">' + esc(T('audD_' + AUD_KEYS[audIdx()])) + '</div>';
  if (XZ.qsOpen) { var qs = ''; (C.quick || []).forEach(function (q) { qs += '<button class="qs" data-a="chatq">' + esc(q) + '</button>'; }); h += '<div class="qsp">' + qs + '</div>'; }
  h += '<div class="optline"><span class="optlab">' + esc(T('lenT')) + '</span>' + optChips(ln, lenIdx(), 'len') + '</div>';
  if (sk) h += '<div class="optline"><span class="optlab">' + esc(T('bgT')) + '</span>' + optChips(T('bgs').split('|'), bgIdx(), 'bg') + '</div>';
  return h + '</div>';
}
function paintOpts() { var el = $('#xkOpts'); if (el) el.innerHTML = optsHtml(); }
function fuHtml() { var a = T('fu_' + AUD_KEYS[audIdx()]).split('|'), h = '<div class="fu">'; a.forEach(function (x) { var p = x.split('~'); h += '<button class="fu-chip" data-a="fu" data-q="' + esc(p[1] || p[0]) + '">' + esc(p[0]) + '</button>'; }); return h + '</div>'; }
function chatLogHtml() {
  if (!S.chat.length) return '<div class="xk-empty" style="text-align:left">' + esc(T('xzHi', appName())) + '<br><span class="xk-sm">' + esc(T('xzNote')) + '</span></div>';
  var h = '';
  S.chat.forEach(function (m, i) {
    if (m.role === 'user') { h += '<div class="msg user">' + esc(m.text) + '</div>'; return; }
    var lg = !m.wait && !m.cont && msgLong(m), fd = lg && m.fold;
    h += '<div class="msg ai' + (fd ? ' fold' : '') + '" id="xkm' + i + '"><div class="mb">' + (m.wait ? '<span class="typing"><i></i><i></i><i></i></span> ' + esc(T('thinking')) : md(m.text)) + (m.cont ? '<p class="xk-sm"><span class="typing"><i></i><i></i><i></i></span> ' + esc(T('xzCont')) + '</p>' : '') + '</div>' +
      (lg ? '<button class="more" data-a="mfold" data-i="' + i + '">' + esc(T(fd ? 'foldMore' : 'foldLess')) + '</button>' : '') +
      (m.wait || m.cont ? '' : '<div class="macts"><button class="ma' + (isFav(m.text) ? ' on' : '') + '" data-a="mfav" data-i="' + i + '">★ ' + esc(T('favB')) + '</button><button class="ma" data-a="mshare" data-i="' + i + '">↗ ' + esc(T('share')) + '</button><button class="ma" data-a="mcard" data-i="' + i + '">🖼 ' + esc(T('makeCard')) + '</button><button class="ma" data-a="mcopy" data-i="' + i + '">⧉ ' + esc(T('copy')) + '</button><button class="ma" data-a="mtts" data-i="' + i + '" data-xk-say="m' + i + '" data-xk-lab="0">🔊</button><button class="ma" data-a="mdel" data-i="' + i + '">✕</button></div>' + (i === S.chat.length - 1 && m.ok && !chatBusy ? fuHtml() : '')) + '</div>';
  });
  return h;
}
function paintChat() { var log = $('#xkLog'); if (!log) return; log.innerHTML = chatLogHtml(); paintBtns(); var bd = $('#xkBd'); if (bd) setTimeout(function () { var l = S.chat[S.chat.length - 1], ms = log.querySelectorAll('.msg'), e = ms[ms.length - 1]; if (l && l.role !== 'user' && !l.wait && !l.cont && e && e.scrollIntoView && (l.text || '').length > 160) e.scrollIntoView({ block: 'start' }); else bd.scrollTop = bd.scrollHeight; }, 30); }
function drawChat() {
  var el = $('.xk-chat');
  if (!el) { el = document.createElement('div'); el.className = 'xk-chat'; document.body.appendChild(el); el.onclick = chatClick; }
  el.className = 'xk-chat' + (XZ.open ? ' on' : ''); el.style.setProperty('--xkfs', FS[S.set.fs] + 'px');
  if (!XZ.open) { el.innerHTML = ''; return; }
  var ct = ctxTitle();
  el.innerHTML = '<div class="hd"><button class="ib" data-a="xclose" aria-label="close">✕</button><div class="grow"><b>' + esc(T('xz')) + '</b></div><button class="ib fs" data-a="xfs" aria-label="Aa">A</button><button class="bt" data-a="mfoldall" title="' + esc(T('foldAll')) + '">' + esc(T('foldAllB')) + '</button><button class="bt" data-a="mclear">' + esc(T('xzNew')) + '</button></div>' +
    '<div class="bd" id="xkBd">' + (ct ? '<div class="ctxchip">' + esc(T('xzCtxChip', ct)) + '</div>' : '') + '<div id="xkOpts">' + optsHtml() + '</div><div class="log" id="xkLog">' + chatLogHtml() + '</div></div>' +
    '<div class="ft"><textarea id="xkIn" rows="1" placeholder="' + esc(T('xzPh')) + '"></textarea><button class="pri" data-a="send">' + esc(T('send')) + '</button></div>';
  var inp = $('#xkIn'); if (inp) inp.onkeydown = function (e) { if (e.keyCode === 13 && !e.shiftKey) { e.preventDefault(); sendChat(inp.value); } };
  paintBtns(); var bd = $('#xkBd'); if (bd) bd.scrollTop = bd.scrollHeight;
}
function openChat(q, src) {
  XZ.open = true; if (src) chatCtx = src; drawChat(); if (q) sendChat(q);
}
function closeChat() { XZ.open = false; drawChat(); }
function reAnswer(msg) {
  if (chatBusy || S.chat.length < 2) return false;
  var a = S.chat[S.chat.length - 1], u = S.chat[S.chat.length - 2];
  if (a.role === 'user' || a.wait || u.role !== 'user') return false;
  S.chat.splice(S.chat.length - 2, 2); chatCtx = u.src || null; save(); if (msg) toast(msg); sendChat(u.text); return true;
}
function ajax(url, payload, cb) {
  var x = new XMLHttpRequest(); x.open('POST', url, true); x.setRequestHeader('Content-Type', 'application/json'); x.timeout = 90000;
  x.onload = function () { cb(x.status, x.responseText); }; x.onerror = x.ontimeout = function () { cb(0, ''); };
  try { x.send(JSON.stringify(payload)); } catch (e) { cb(0, ''); }
}
function sendChat(text) {
  text = trim(text); if (!text || chatBusy) return; var inp = $('#xkIn'); if (inp) inp.value = '';
  if (navigator.onLine === false) { S.chat.push({ role: 'user', text: text, ts: now() }); S.chat.push({ role: 'ai', text: T('xzOffline'), ts: now() }); save(); paintChat(); return; }
  S.chat.push({ role: 'user', text: text, src: chatCtx, ts: now() }); var src = chatCtx; chatCtx = null;
  S.chat.push({ role: 'ai', text: '', wait: true, src: src }); if (S.chat.length > 60) S.chat = S.chat.slice(-60); chatBusy = true; XZ.opt = false; XZ.qsOpen = false; XZ.audOpen = false; paintOpts(); paintChat();
  var msgs = []; S.chat.forEach(function (m) { if (!m.wait && m.text) msgs.push({ role: m.role === 'user' ? 'user' : 'assistant', content: m.text }); }); msgs = msgs.slice(-12);
  while (msgs.length && msgs[0].role !== 'user') msgs.shift();
  var acc = '', last = S.chat[S.chat.length - 1];
  function done(r, st) {
    last.wait = false; last.cont = false; foldOld(); last.fold = false; last.ok = !!r; last.text = r || T('xzFail') + (st ? '（http ' + st + '）' : ''); last.ts = now();
    chatBusy = false; save(); if (XZ.open) paintChat(); else toast(T('xzReplied'));
  }
  (function round(k) {
    var ms = msgs.slice(); if (k) { ms.push({ role: 'assistant', content: acc }); ms.push({ role: 'user', content: T('xzGoOn') }); }
    var payload = { model: SVC.model, max_tokens: 1600, system: sysPrompt(), messages: ms };
    (function attempt(n) {
      ajax(SVC.xz, payload, function (st, txt) {
        var r = '', d = null;
        if (st === 200) { try { d = JSON.parse(txt); r = extractReply(d); } catch (e) { r = txt; } }
        if (!r && n < 2) { setTimeout(function () { attempt(n + 1); }, 900 * (n + 1)); return; }
        if (!r) { done(acc, acc ? 0 : st); return; }
        acc = k ? joinCont(acc, r) : r;
        if (k < 4 && cutOff(d, acc)) { last.wait = false; last.cont = true; last.text = acc; if (XZ.open) paintChat(); round(k + 1); return; }
        done(acc, st);
      });
    })(0);
  })(0);
}
function chatClick(e) {
  var n = e.target.closest ? e.target.closest('button') : null; if (!n) return; var a = n.getAttribute('data-a'), i = +n.getAttribute('data-i');
  if (a === 'xclose') closeChat();
  else if (a === 'xfs') { S.set.fs = (S.set.fs + 1) % FS.length; save(); var c = $('.xk-chat'); if (c) c.style.setProperty('--xkfs', FS[S.set.fs] + 'px'); toast(T('fsN', S.set.fs + 1)); }
  else if (a === 'send') sendChat(($('#xkIn') || {}).value);
  else if (a === 'opt') { XZ.opt = !XZ.opt; paintOpts(); }
  else if (a === 'audtog') { XZ.audOpen = !XZ.audOpen; if (XZ.audOpen) XZ.qsOpen = false; paintOpts(); }
  else if (a === 'qstog') { XZ.qsOpen = !XZ.qsOpen; if (XZ.qsOpen) XZ.audOpen = false; paintOpts(); }
  else if (a === 'aud') { S.set.aud = AUD_KEYS[i]; save(); XZ.audOpen = false; paintOpts(); toast(T('audSet', T('auds').split('|')[i].replace(/^\S+\s/, ''))); }
  else if (a === 'len') { S.set.alen = LEN_KEYS[i]; save(); paintOpts(); var ln = T('lens').split('|')[i]; if (!reAnswer(T('lenSet', ln))) toast(T('lenSet2', ln)); }
  else if (a === 'bg') { S.set.skbg = BG_KEYS[i]; save(); paintOpts(); var bn = T('bgNames').split('|')[i]; if (!reAnswer(T('bgSet', bn))) toast(T('bgSet2', bn)); }
  else if (a === 'chatq') sendChat(n.textContent);
  else if (a === 'fu') sendChat(n.getAttribute('data-q'));
  else if (a === 'mclear') { if (!S.chat.length || confirm(T('delConfirm'))) { S.chat = []; XZ.ctx = null; save(); paintChat(); } }
  else if (a === 'mfoldall') foldAll();
  else if (a === 'mfold') { var m = S.chat[i]; if (m) { m.fold = !m.fold; save(); var el = $('#xkm' + i); if (!el) { paintChat(); return; } el.className = 'msg ai' + (m.fold ? ' fold' : ''); var b = el.querySelector('.more'); if (b) b.textContent = T(m.fold ? 'foldMore' : 'foldLess'); } }
  else if (a === 'mfav') { var mt = S.chat[i].text; if (isFav(mt)) { for (var j = 0; j < S.fav.length; j++) if (S.fav[j].text === mt) { S.fav.splice(j, 1); break; } } else { S.fav.push({ text: mt, ts: now() }); toast(T('favSaved')); } save(); paintChat(); }
  else if (a === 'mshare') { var ms = S.chat[i], head = ms.src ? '「' + ms.src.t + '」\n—— ' + (ms.src.ref || '') + '\n\n' : ''; shareText(head + mdStrip(ms.text) + '\n\n—— ' + appName() + ' · 國度321空中團契'); }
  else if (a === 'mcopy') copyText(mdStrip(S.chat[i].text));
  else if (a === 'mcard') {
    var mm = S.chat[i], q = ''; for (var u = i - 1; u >= 0; u--) if (S.chat[u].role === 'user') { q = S.chat[u].text; break; }
    if (window.GXU && window.GXU.answer) { try { window.GXU.answer(mm.text, q); return; } catch (er) { } }
    openCard({ text: mm.src ? mm.src.t : cardText(mm.text), ref: mm.src ? (mm.src.ref || appName()) : appName(), note: mm.src ? cardText(mm.text) : '', plain: true });
  }
  else if (a === 'mtts') { if (spk.on && spk.key === 'm' + i) stopSpeak(); else sayText(mdSpeak(S.chat[i].text), 'm' + i, T('xz')); }
  else if (a === 'mdel') { S.chat.splice(i, 1); if (S.chat[i - 1] && S.chat[i - 1].role === 'user' && (!S.chat[i] || S.chat[i].role === 'user')) S.chat.splice(i - 1, 1); save(); paintChat(); }
}

/* ---------- 浮動按鈕、卡片朗讀鈕 ---------- */
function pageItems() {
  var root = (typeof C.root === 'string' ? $(C.root) : C.root) || document.body, items = [];
  var sp = $$('.xks', root).filter(function (s) { return s.offsetParent !== null; });
  sp.forEach(function (s) { var t = trim(s.textContent.replace(/\s+/g, ' ')); if (t) items.push({ text: t, el: s }); });
  return items;
}
function readPage() {
  if (spk.on && spk.key === 'page') { stopSpeak(); return; }
  scan(); var it = pageItems(); if (!it.length) { toast(T('nothingRead')); return; }
  var first = 0; for (var i = 0; i < it.length; i++) { var r = it[i].el.getBoundingClientRect(); if (r.top >= 0) { first = i; break; } }
  startSpeak(it, 'page', ctxTitle() || appName(), first);
}
function ensureButtons() {
  if (C.perBlock) {
    $$(C.perBlock.sel).forEach(function (host) {
      if (host.getAttribute('data-xk-b')) return; host.setAttribute('data-xk-b', '1');
      var b = document.createElement('button'); b.type = 'button'; b.className = 'xk-say ' + (C.perBlock.cls || ''); b.setAttribute('data-xk-lab', 'full');
      var key = 'b' + fnv(trim(host.textContent).slice(0, 80)); b.setAttribute('data-xk-say', key); b.textContent = '🔊 ' + T('readAloud');
      b.onclick = function (e) { e.stopPropagation(); var tx = C.perBlock.text ? C.perBlock.text(host) : trim(host.textContent); sayText(tx, key, ctxTitle() || appName()); };
      var anchor = C.perBlock.anchor ? host.querySelector(C.perBlock.anchor) : null;
      if (anchor) anchor.insertBefore(b, anchor.firstChild); else host.appendChild(b);
    });
  }
}
function mountFabs() {
  if ($('#xkFabs')) return;
  var f = document.createElement('div'); f.id = 'xkFabs'; f.className = 'xk-fabs';
  f.innerHTML = '<button id="xkFabXz" data-a="xz" aria-label="小智">💬</button><button id="xkFabRead" data-a="read" aria-label="朗讀">🔊</button>' + (C.blocks ? '<button id="xkFabMarks" data-a="marks" aria-label="畫線">🖍</button>' : '');
  document.body.appendChild(f);
  f.onclick = function (e) {
    var n = e.target.closest ? e.target.closest('button') : null; if (!n) return; var a = n.getAttribute('data-a');
    if (a === 'xz') openChat(); else if (a === 'read') readPage(); else if (a === 'marks') openMarks();
  };
}
function css() {
  if ($('#xkCss')) return; var s = document.createElement('style'); s.id = 'xkCss';
  s.textContent = ".xk-toast{position:fixed;left:50%;bottom:calc(88px + env(safe-area-inset-bottom));transform:translateX(-50%);background:rgba(20,24,30,.92);color:#fff;padding:9px 16px;border-radius:999px;font-size:14px;z-index:100000;max-width:86vw;text-align:center;pointer-events:none}\n.xks{cursor:pointer;-webkit-tap-highlight-color:transparent;border-radius:3px}\n.xks[data-hl]{background:rgba(224,176,64,.38);box-decoration-break:clone;-webkit-box-decoration-break:clone}\n.xks[data-hl=green]{background:rgba(90,174,106,.32)}.xks[data-hl=blue]{background:rgba(91,141,214,.30)}.xks[data-hl=pink]{background:rgba(232,138,160,.34)}.xks[data-hl=purple]{background:rgba(164,127,203,.32)}.xks[data-hl=maroon]{background:rgba(140,74,74,.28)}.xks[data-hl=brown]{background:rgba(154,107,62,.30)}.xks[data-hl=charcoal]{background:rgba(85,91,94,.24)}\n.xks.xk-reading{outline:2px solid __BRAND__;outline-offset:1px;background:rgba(255,214,102,.45)}\n.xk-note{margin:6px 0 10px;padding:8px 12px;border-left:3px solid #E0B040;background:rgba(224,176,64,.14);border-radius:0 10px 10px 0;font-size:.92em;line-height:1.7;white-space:pre-wrap}\n.xk-fabs{position:fixed;right:12px;bottom:calc(86px + env(safe-area-inset-bottom));z-index:9000;display:flex;flex-direction:column;gap:10px}\n.xk-fabs button{width:46px;height:46px;border-radius:50%;border:0;background:__BRAND__;color:#fff;font-size:20px;box-shadow:0 3px 12px rgba(0,0,0,.28);cursor:pointer;padding:0;line-height:1}\n.xk-fabs button.on{outline:3px solid #F2C75C}\n.xk-say{margin:8px 8px 0 0;border:1px solid __BRAND__;background:transparent;color:__BRAND__;border-radius:999px;padding:5px 12px;font:inherit;font-size:.86em;cursor:pointer}\n.xk-say.on{background:__BRAND__;color:#fff}\n.xk-bar{position:fixed;left:8px;right:8px;bottom:calc(14px + env(safe-area-inset-bottom));z-index:99990;display:flex;align-items:center;gap:6px;background:rgba(20,28,40,.95);color:#fff;border-radius:999px;padding:6px 10px;box-shadow:0 4px 18px rgba(0,0,0,.35);font-size:13px}\n.xk-bar button{border:0;background:rgba(255,255,255,.16);color:#fff;border-radius:999px;min-width:34px;height:34px;font-size:15px;cursor:pointer;padding:0 8px;flex:none}\n.xk-bar button.w{font-size:12px}.xk-bar .t{flex:1 1 0;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n.xk-sheet{position:fixed;inset:0;z-index:99980;background:rgba(0,0,0,.45);display:flex;align-items:flex-end}\n.xk-card{background:#fff;color:#23211C;width:100%;max-height:88vh;overflow:auto;border-radius:18px 18px 0 0;padding:16px 16px calc(16px + env(safe-area-inset-bottom));box-sizing:border-box;font-size:15px}\n.xk-st{font-weight:800;font-size:16px;margin-bottom:8px;display:flex;flex-wrap:wrap;gap:8px;align-items:baseline}.xk-st span{font-weight:500;font-size:13px;color:#6B6255}\n.xk-quote{background:#F5EBD9;border-radius:10px;padding:10px 12px;line-height:1.75;margin-bottom:12px;max-height:30vh;overflow:auto;white-space:pre-wrap}\n.xk-row{display:flex;align-items:center;gap:10px;margin-bottom:12px;flex-wrap:wrap}.xk-lab{font-size:13px;color:#6B6255;white-space:nowrap}\n.xk-sws{display:flex;gap:10px;flex-wrap:wrap}.xk-sw{width:30px;height:30px;border-radius:50%;border:2px solid transparent;cursor:pointer;padding:0}.xk-sw.on{border-color:#23211C;box-shadow:0 0 0 2px #fff inset}\n.xk-span{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.xk-span button{border:1px solid #CFC7B2;background:#fff;border-radius:9px;min-width:38px;height:36px;font-size:16px;font-weight:700;cursor:pointer;padding:0 10px;color:#23211C}.xk-span button.w{font-size:13.5px}.xk-span b{min-width:50px;text-align:center;font-size:14px}\n.xk-ta{width:100%;box-sizing:border-box;border:1px solid #CFC7B2;border-radius:10px;padding:10px 12px;font:inherit;font-size:15px;min-height:76px;resize:vertical;background:#FAF7F0;color:#23211C;margin-bottom:12px}\n.xk-acts,.xk-acts2{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:8px}.xk-acts button{flex:1;min-width:0}\n.xk-card button:not(.xk-sw){border:1px solid #CFC7B2;background:#fff;color:#23211C;border-radius:10px;padding:9px 12px;font:inherit;font-size:14px;font-weight:600;cursor:pointer}\n.xk-card button.pri{background:__BRAND__;border-color:__BRAND__;color:#fff}.xk-card button.gold{background:#B8892B;border-color:#B8892B;color:#fff}.xk-card button.bad{color:#B4432F;border-color:#B4432F}\n.xk-marks{position:fixed;inset:0;z-index:99985;background:#FBF8F2;color:#23211C;display:flex;flex-direction:column}\n.xk-mh{display:flex;align-items:center;justify-content:space-between;padding:calc(12px + env(safe-area-inset-top)) 16px 12px;background:__BRAND__;color:#fff;font-size:17px}.xk-mh button{border:0;background:rgba(255,255,255,.18);color:#fff;border-radius:10px;width:38px;height:38px;font-size:18px;cursor:pointer}\n.xk-mb{flex:1;overflow:auto;padding:12px 14px 30px}.xk-empty{padding:26px 8px;color:#6B6255;line-height:1.8}\n.xk-mi{background:#fff;border:1px solid #E3DDCC;border-left:5px solid #E0B040;border-radius:12px;padding:10px 12px;margin-bottom:10px}\n.xk-mi[data-c=green]{border-left-color:#5AAE6A}.xk-mi[data-c=blue]{border-left-color:#5B8DD6}.xk-mi[data-c=pink]{border-left-color:#E88AA0}.xk-mi[data-c=purple]{border-left-color:#A47FCB}.xk-mi[data-c=maroon]{border-left-color:#8C4A4A}.xk-mi[data-c=brown]{border-left-color:#9A6B3E}.xk-mi[data-c=charcoal]{border-left-color:#555B5E}\n.xk-mi .q{line-height:1.75;font-size:15px}.xk-mi .r{font-size:12.5px;color:#6B6255;margin-top:4px}.xk-mi .n{font-size:13.5px;margin-top:6px;color:#3A3122}.xk-mi .a{display:flex;gap:8px;margin-top:8px}\n.xk-mi .a button{border:1px solid #CFC7B2;background:#fff;border-radius:999px;padding:4px 12px;font-size:13px;cursor:pointer;color:#23211C}\n.xk-chat{position:fixed;inset:0;z-index:99970;background:#FBF8F2;color:#23211C;display:none;flex-direction:column;--xkfs:17px}\n.xk-chat.on{display:flex;height:100vh;height:100dvh}\n.xk-chat .hd{display:flex;align-items:center;gap:8px;padding:calc(10px + env(safe-area-inset-top)) 10px 10px;background:__BRAND__;color:#fff}\n.xk-chat .hd .grow{flex:1 1 auto;min-width:0;font-size:17px}.xk-chat .hd .ib{width:38px;height:38px;border-radius:10px;border:0;background:rgba(255,255,255,.18);color:#fff;font-size:18px;cursor:pointer;flex:none}.xk-chat .hd .ib.fs{font-weight:800}\n.xk-chat .hd .bt{border:0;background:rgba(255,255,255,.18);color:#fff;border-radius:10px;padding:7px 10px;font-size:13px;white-space:nowrap;cursor:pointer;flex:none}\n.xk-chat .bd{flex:1 1 auto;min-height:0;overflow:auto;padding:12px max(10px,calc((100% - 760px)/2));-webkit-overflow-scrolling:touch}\n.xk-chat .ctxchip{font-size:12.5px;color:#8A6A2A;background:#F5EBD9;border-radius:10px;padding:6px 10px;margin-bottom:8px}\n.xk-chat .opt-sum{display:flex;align-items:center;justify-content:space-between;gap:8px;width:100%;border:1px solid #CFC7B2;background:#fff;border-radius:14px;padding:10px 14px;margin-bottom:8px;cursor:pointer;font-size:14px;text-align:left;color:#23211C}.xk-chat .opt-sum span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0}\n.xk-chat .opt-body{margin-bottom:8px}.xk-chat .optrow{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:8px}.xk-chat .tg{border:1px solid __BRAND__;background:#fff;color:__BRAND__;border-radius:999px;padding:7px 14px;cursor:pointer;font-size:13.5px;font-weight:600}.xk-chat .tg.on{background:__BRAND__;color:#fff}\n.xk-chat .optline{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin:8px 0}.xk-chat .optlab{font-size:13.5px;color:#6B6255}.xk-chat .audgrid{display:flex;flex-wrap:wrap;gap:8px}\n.xk-chat .chip{border:1px solid #CFC7B2;background:#fff;color:#23211C;border-radius:999px;padding:6px 12px;font-size:13.5px;cursor:pointer}.xk-chat .chip.on{background:__BRAND__;border-color:__BRAND__;color:#fff}\n.xk-chat .qsp{display:flex;flex-direction:column;gap:6px;margin-bottom:8px}.xk-chat .qs{border:1px solid #E3DDCC;background:#fff;border-radius:12px;padding:8px 12px;text-align:left;cursor:pointer;font-size:13.5px;color:#23211C}\n.xk-chat .log{display:flex;flex-direction:column;gap:10px}\n.xk-chat .msg{max-width:92%;padding:10px 14px;border-radius:16px;line-height:1.8;font-size:var(--xkfs);overflow-wrap:anywhere;box-sizing:border-box}\n.xk-chat .msg.user{background:__BRAND__;color:#fff;margin-left:auto;border-bottom-right-radius:4px;white-space:pre-wrap}\n.xk-chat .msg.ai{background:#fff;border:1px solid #E3DDCC;border-bottom-left-radius:4px;width:100%;max-width:100%}\n.xk-chat .msg.ai h4{margin:.7em 0 .3em;color:__BRAND__;font-size:1.03em;border-bottom:1px dashed #E3DDCC;padding-bottom:.2em}.xk-chat .msg.ai p{margin:.4em 0}.xk-chat .msg.ai ul,.xk-chat .msg.ai ol{padding-left:1.3em;margin:.4em 0}\n.xk-chat .msg.ai blockquote{margin:.6em 0;border-left:3px solid #E0B040;background:#F5EBD9;padding:6px 12px;border-radius:0 8px 8px 0}\n.xk-chat .xk-tb{border-collapse:collapse;font-size:.93em;margin:.5em 0;display:block;overflow-x:auto}.xk-chat .xk-tb th,.xk-chat .xk-tb td{border:1px solid #E3DDCC;padding:6px 9px}.xk-chat .xk-tb th{background:#F5EBD9}\n.xk-chat .msg.ai.fold .mb{max-height:9.6em;overflow:hidden;-webkit-mask-image:linear-gradient(#000 55%,transparent);mask-image:linear-gradient(#000 55%,transparent)}\n.xk-chat .more{display:block;margin:6px 0 0;padding:4px 12px;border:1px solid #E3DDCC;border-radius:999px;background:#F2EEE3;color:__BRAND__;font-size:.8em;font-weight:600;cursor:pointer}\n.xk-chat .macts{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}.xk-chat .ma{border:1px solid #E3DDCC;background:#F2EEE3;border-radius:999px;padding:3px 10px;font-size:.82em;cursor:pointer;color:#23211C}.xk-chat .ma.on{background:#F5EBD9;border-color:#B8892B}\n.xk-chat .fu{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px}.xk-chat .fu-chip{border:1px solid #B8892B;background:#fff;border-radius:999px;padding:5px 12px;font-size:.84em;cursor:pointer;color:#23211C}\n.xk-chat .ft{display:flex;gap:8px;padding:10px max(10px,calc((100% - 760px)/2)) calc(10px + env(safe-area-inset-bottom));border-top:1px solid #E3DDCC;background:#fff}\n.xk-chat .ft textarea{flex:1;min-height:46px;max-height:30vh;border:1px solid #CFC7B2;border-radius:12px;padding:10px 12px;font:inherit;font-size:max(16px,var(--xkfs));resize:none;background:#FAF7F0;color:#23211C}\n.xk-chat .ft .pri{border:0;background:__BRAND__;color:#fff;border-radius:12px;padding:0 18px;font-size:15px;font-weight:700;cursor:pointer;flex:none;white-space:nowrap}\n.xk-sm{font-size:12.5px;color:#6B6255}\n.xk-chat .typing i{display:inline-block;width:6px;height:6px;border-radius:50%;background:#B8892B;margin:0 2px;animation:xkb 1s infinite}.xk-chat .typing i:nth-child(2){animation-delay:.2s}.xk-chat .typing i:nth-child(3){animation-delay:.4s}\n@keyframes xkb{0%,80%,100%{opacity:.25}40%{opacity:1}}\n@media (max-width:360px){.xk-chat .hd .bt{padding:7px 8px;font-size:12px}}\n@media (prefers-color-scheme:dark){\n.xk-card,.xk-marks,.xk-chat{background:#1E1B16;color:#ECE6D8}.xk-quote,.xk-ta{background:#2B261C;color:#ECE6D8;border-color:#4A4436}.xk-card button:not(.xk-sw){background:#26221B;color:#ECE6D8;border-color:#4A4436}.xk-span button{background:#26221B;color:#ECE6D8;border-color:#4A4436}.xk-lab,.xk-st span,.xk-sm,.xk-mi .r,.xk-chat .optlab{color:#B4AB98}\n.xk-mi{background:#26221B;border-color:#38332A}.xk-mi .n{color:#ECE6D8}.xk-mi .a button{background:#2B261C;color:#ECE6D8;border-color:#4A4436}\n.xk-chat .opt-sum,.xk-chat .chip,.xk-chat .qs,.xk-chat .msg.ai,.xk-chat .fu-chip,.xk-chat .ft,.xk-chat .tg{background:#26221B;color:#ECE6D8;border-color:#4A4436}.xk-chat .tg{color:#D4A65B}.xk-chat .chip.on,.xk-chat .tg.on{background:__BRAND__;color:#fff}.xk-chat .msg.ai blockquote,.xk-chat .ctxchip,.xk-chat .xk-tb th{background:#332A19}.xk-chat .ma,.xk-chat .more{background:#2B261C;color:#ECE6D8;border-color:#4A4436}.xk-chat .ft textarea{background:#2B261C;color:#ECE6D8;border-color:#4A4436}\n}".replace(/__BRAND__/g, BRAND);
  document.head.appendChild(s);
}
document.addEventListener('click', function (e) {
  var t = e.target; if (!t || !t.closest) return;
  var s = t.closest('.xks'); if (s && !t.closest('a,button,input,textarea,select,[onclick]')) { if (window.getSelection && String(window.getSelection()).length > 1) return; if (C.skipTap && C.skipTap(s)) return; onSentTap(s); }
}, false);
function start() {
  css(); mountFabs(); scan(); ensureButtons();
  var root = (typeof C.root === 'string' ? $(C.root) : C.root) || document.body;
  try { new MutationObserver(function () { schedScan(); }).observe(root, { childList: true, subtree: true }); } catch (e) { }
  if (window.speechSynthesis) try { speechSynthesis.getVoices(); } catch (e) { }
}
window.XK = { open: openChat, close: closeChat, say: sayText, stop: stopSpeak, readPage: readPage, marks: openMarks, scan: scan, state: S, cfg: C };
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
