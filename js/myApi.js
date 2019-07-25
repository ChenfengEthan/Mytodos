
    /**
     * 获取元素，传入选择器，返回单个元素
     * @param selector  --> css选择器
     * @returns {any}
     */
    function getElement(selector) {
        return document.querySelector(selector);
    }
    /**
     * 修改类名
     * @param str -->className
     * @param node -->dom节点
     */
    function changeClass (str,node) {
        node.className = str;
    }

    /**
     * 改变选择状态
     * @param nodeList --->节点列表
     * @param changeWay --->传入的是布尔值
     */
    function checkStatus(nodeList,changeWay) {
        if (changeWay === true) {
            for (let i = 0;i < nodeList.length;i++) {
                nodeList[i].checked = false;
            }
        }
        if (changeWay === false) {
            for (let k = 0;k < nodeList[k]; k++) {
                nodeList[k].checked = true;
            }
        }
    }

    /**
     * 检查元素的checked状态
     * @param node -->传入单个节点
     * @returns {boolean} -->返回该节点的checked状态，true或者false
     */
    function getStatus(node) {
        return node.checked;
    }
    /**
     * 元素显示
     * @param node--->元素列表
     */
    function show(node) {
        node.style.display = "block";
    }

    /**
     * 元素隐藏
     * @param nodeList --->元素节点列表
     */
    function hide(node) {
        node.style.display = "none";
    }
    /**
     * 创建元素节点
     * @param tag
     * @returns {any} --->返回元素节点
     */
    function creatEle(tag) {
        return document.createElement(tag);
    }

    /**
     * 移除节点
     * @param parent -->父节点
     * @param children -->要移除的子节点
     */
    function delNode(parent,children) {
        parent.removeChild(children);
    }

    /**
     *筛选节点，符合条件的显示，不符合条件隐藏
     *
     * @param {*} node
     * @param {*} sta
     * @param {*} val
     */
    function filtrateNode(node,sta,val) {
        if(node.getAttribute(sta) === val) {
            show(node);
        }else{
            hide(node);
        }
    }

    /**
     *[传入一个元素获取它的所有父级兄弟元素]
     *
     * @param {*} ele
     */
    function sibling(ele) {
        let a = [];
        let p = ele.parentNode.parentNode.children;
        for(let i = 0;i < p.length;i++) {
            if(p[i].nodeType == 1 && p[i] != ele) {
                a.push(p[i]);
            }
        }
        return a; 
    }
    
    /**
     *事件绑定
     *
     * @param {*} ele 要绑定事件的元素
     * @param {*} event 事件类型
     * @param {*} func 绑定函数
     * @param {*} [isbubbling] 是否捕获
     */
    function bindEvent(ele,event,func,isbubbling) {
        if(!isbubbling) {
            isbubbling = false;
        }
        ele.addEventListener(event,func,isbubbling)
    }
    function nondeIndexOf(parent,target) {
        for(let i = 0;i < parent.children.length;i++) {
            if(parent.children[i] === target) {
                return i;
            }else {
                return false;
            }
        }
    }
    function exchange(id1,id2,list) {
        temp1 = list[id1];
        temp2 = list[id2];
        console.log(temp1);
        console.log(temp2);
        list.splice(id1,1,temp2);
        list.splice(id2,1,temp1);
    } 