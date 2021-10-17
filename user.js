// ==UserScript==
// @name        Misskey Translation Script
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  A Translation Script for Misskey Note | 一个用于misskey贴文的翻译脚本
// @author       dogcraft
// @match        https://m.dogcraft.cn/*
// @grant        none
// ==/UserScript==

var ApiUrl = 'https://test1-api.dogcraft.top/ts/';


(function () {
    'use strict';


    console.log('Misskey Translate Script v1.3');
    var vdog = localStorage.getItem('v');



    var cat = localStorage.getItem('lang');
    if (cat == null) {
        var lang_dog = navigator.language || navigator.userLanguage;
    } else {
        lang_dog = cat;
    }

    lang_dog = navigator.language || navigator.userLanguage;//获取浏览器的语言
    lang_dog = lang_dog.substr(0, 2);

    function dog_add_fy(eldog) {
        //添加翻译按钮、区域以及绑定点击事件
        if (eldog.fanyi == 1) {
            console.log('已经添加过了，重复添加。')
        } else {
            var cl = document.createElement('div');
            cl.className = '.clear';
            var cl2 = document.createElement('div');
            cl2.className = '.clear';
            var dogfy = document.createElement('span');
            dogfy.className = 'fanyi';
            dogfy.ct = 0;
            var dogbt = document.createElement('button');
            dogbt.innerText = 'Translate';
            dogbt.className = 'button _button';
            dogbt.style.backgroundColor = "rgba(0,0,200,0.5)";
            dogbt.addEventListener('click', dog_fy);//绑定翻译函数
            eldog.appendChild(cl);
            eldog.appendChild(dogfy);
            eldog.appendChild(cl2);
            eldog.appendChild(dogbt);
            eldog.fanyi = 1;
        }

    }

    async function dog_fy() {
        //从后端获得翻译文本并写入到html中
        var pdog = this.parentElement;
        var ldog = pdog.getElementsByClassName('fanyi');
        if (ldog.length > 0) {
            var dog_fy_el = ldog[0];
            if (dog_fy_el.ct == 0) {
                var hdog = pdog.getElementsByClassName('havbbuyv')[0].innerText;
                var post_dog = { 'c': hdog, 't': lang_dog };
                dog_fy_el.innerText = 'Translating……';
                var uiy = await fetch(ApiUrl, {
                    method: 'POST',
                    body: JSON.stringify(post_dog),
                    headers: new Headers({
                        'Content-Type': 'application/json'
                    })
                });
                if (uiy.status == 200) {
                    var rt = await uiy.json();
                    var res_dog = rt.r;
                } else {
                    res_dog = '接口不对劲';
                }
                dog_fy_el.innerText = `\n${res_dog}`;
                dog_fy_el.ct = 1
                this.innerText = 'folded';

            } else {
                if (dog_fy_el.ct == 2) {
                    console.log(dog_fy_el.style.display)
                    dog_fy_el.style.display = "";
                    dog_fy_el.ct = 1;
                    this.innerText = 'folded';
                } else if (dog_fy_el.ct == 1) {
                    dog_fy_el.style.display = "none";
                    dog_fy_el.ct = 2;
                    this.innerText = 'unfolded';
                }
            }
        } else {
            console.log('有地方不对劲');
        }
    }

    var config = { attributes: false, childList: true, subtree: true };
    var sj = []
    // 当观察到突变时执行的回调函数
    var callback = function (mutationsList) {
        mutationsList.forEach(function (item, index) {
            if (item.type == 'childList') {
                for (let iy_dog = 0; iy_dog < item.addedNodes.length; iy_dog++) {
                    const iadog = item.addedNodes[iy_dog];
                    if (iadog.getElementsByClassName == undefined) {
                    } else {
                        sld = iadog.getElementsByClassName('content');
                        if (sld.length > 0) {
                            for (let ct_dog = 0; ct_dog < sld.length; ct_dog++) {
                                const sdldog = sld[ct_dog];
                                tty = sdldog.getElementsByClassName('text');
                                if (tty.length > 0) {
                                    dog_add_fy(tty[0]);
                                }
                            }
                        }
                    }
                }
            }
        });
    };


    function getar() {
        var dogui = localStorage.getItem('ui');
        if (dogui == null) {
            localStorage.setItem("ui", "default");
            dogui = "default";
        }
        if (vdog >= "12.76.0") {
            if (dogui == 'chat') {
                var ar = document.getElementsByClassName("main")[0];
            } else if (dogui == 'pope') {
                var ar = document.getElementsByClassName("content")[0];
            }
            else {
                var ar = document.getElementsByClassName("main")[0];
            }
        }
        else {
            var ar = (dogui == 'chat') ? document.getElementsByClassName("main")[0] : document.getElementsByClassName("content")[0];
        }
        if (ar == null) {
            console.log("没找到，等一秒");
            setTimeout(getar, 1000);
            return null;
        }
        else {
            for (let si = 0; si < sl.length; si++) {
                const sl_dog = sl[si];
                dog_add_fy(sl_dog.getElementsByClassName('main')[0].getElementsByClassName('text')[0]);
            }
            console.log("找到了");
            var observer = new MutationObserver(callback);
            observer.observe(ar, config);
            return "dog"
        }
    }


    window.onload = function () {
        console.log('页面加载完毕');
        sl = document.getElementsByClassName('article');
        getar();
    }

})();
