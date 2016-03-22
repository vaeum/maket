var Utils = {
    // https://gist.github.com/1308368
    uuid: (a,b) =>{for(b=a='';a++<36;b+=a*51&52?(a^15?8^Math.random()*(a^20?16:4):4).toString(16):'-');return b},

    translit: (text) => {
        return text.replace(/([а-яё])|([\s_-])|([^a-z\d])/gi,
        function (all, ch, space, words, i) {
            if (space || words) {
                return space ? '-' : '';
            }
            var code = ch.charCodeAt(0),
                index = code == 1025 || code == 1105 ? 0 :
                    code > 1071 ? code - 1071 : code - 1039,
                t = ['yo', 'a', 'b', 'v', 'g', 'd', 'e', 'zh',
                    'z', 'i', 'y', 'k', 'l', 'm', 'n', 'o', 'p',
                    'r', 's', 't', 'u', 'f', 'h', 'c', 'ch', 'sh',
                    'shch', '', 'y', '', 'e', 'yu', 'ya'
                ];
            return t[index];
        });
    },

    // plus = (a, b) => {
    //     function res(a, b, t, c){
    //       if(a.length == 0 && b.length == 0 && !c)
    //         return t;
    //       var l = parseInt(a.pop() || '0') + parseInt(b.pop() || '0') + (c || 0);
    //       return res(a, b, l + (t || ""), l > 9? 1:0);
    //     }
    //     return res(a.toString().split(""), b.toString().split(""), "").toString();
    // }
};
