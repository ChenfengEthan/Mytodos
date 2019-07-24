// todo
//     *属性
//     *功能
//         初始化
//             如果local中有数据，则取出渲染，并且显示底栏
//             无数据则根据id创建
let todoPage = {
    leftnum: 0,
    selectStatus: "all",
    idx: 0,//计数下标
    //数据对象
    userData: {
        localData: [],
        delNum: 0,
    },
    userName: 0,
    //传入一个id获取对应的用户数据
    init(idx) {
        let allBtn = getElement("#allBtn");
        allBtn.style.display = "none";
        if(localStorage.length > 0) {
            this.userData = JSON.parse(localStorage.getItem("todolist"));
            this.idx = this.userData.localData.length;
            //初始化页面的todo
            let todoUl = getElement("#todos");
            todoUl.innerHTML = "";
            for(let i = 0;i < this.userData.localData.length; i++) {
                console.log(77);
                let idx = this.userData.localData[i].idx;
                let content = this.userData.localData[i].content;
                let status = this.userData.localData[i].status;
                //根据localstorage中数据生成todo
                console.log(1);
                let todo = new Todo(idx,content,status);
                todo.flash();
            } 
        }else{
            localStorage.setItem("todolist",JSON.stringify(this.userData));
            todoPage.idx = this.userData.localData.length;
        }
        //删除todo
        let todoUl = getElement("#todos");
        bindEvent(todoUl,"click",function(e) {
            e = e || window.event;
            target = e.target || window.srcElement;
            //删除todo
            if(target.tagName == "IMG") {
                for(let i = todoPage.userData.localData.length-1;i >= 0;i--) {
                    if(todoPage.userData.localData[i].idx == target.parentNode.getAttribute("data-idx")){
                        console.log(44);
                        todoPage.userData.localData.splice(i,1);
                    }
                }
                console.log(todoPage.userData.localData);
                localStorage.setItem("todolist",JSON.stringify(todoPage.userData));
                //底部数据重置
                footer.init();
                let delLi = target.parentNode;
                let parent = delLi.parentNode;
                parent.removeChild(delLi);
            }
            if(target.tagName == "I") {

            }
        })
        footer.init();
        //初始化全选按钮
        if(this.userData.localData.length > 0) {
            allBtn.style.display = "block";
        }
        if(getElement("#count-box").innerText > 0) {
            allBtn.src = "images/arrowdark.png";
        }else{
            allBtn.src = "images/arrowlight.png";
        }
    }
}
// input控件（一个）
//     *属性
            // 全选按钮是否显示
//     *功能
//         初始化
//             初始化全选按钮状态
//         创建todo
//             给local中增加todo数据
//                 回车
//                 tap
//                 鼠标点击
//         改变全选按钮状态
//             改变local中全选按钮状态
//         渲染到页面中
//             获取数据创建todo
let creatTodo = {
    btnStatus: "none",
    todoUl: "#todos",//todoul的选择器
    init() {
        console.log(2);
        let inputTodo = getElement("#input-todo");
        todoPage.userData = JSON.parse(localStorage.getItem("todolist"));
        if(todoPage.userData.localData.length > 0) {
            this.idx = todoPage.userData.localData.length;
        }
        //给输入框绑定键盘事件
        bindEvent(inputTodo,"keydown",function(e) {
            e = e || window.event;
            target = e.target || window.srcElement;
            //监听键盘事件
            if(e.keyCode == 13 || e.keyCode == 9) {
                console.log(3);
                //获取input框内输入内容
                let content = inputTodo.value;
                content.trim();
                if(content == "") {
                    return false;
                }
                inputTodo.value = "";
                //创建新的todo，新创建的todo默认未选中状态
                let idx = (todoPage.idx)++;
                if(todoPage.userData.localData.length > 0) {
                    idx = todoPage.userData.localData[todoPage.userData.localData.length-1].idx+1;
                }
                let todo = new Todo(idx,content,"notcheck-status");
                todo.add();
                footer.init();
            }
        })
        //给输入框绑定鼠标事件,如果点input框之外自动创建todo
        bindEvent(inputTodo,"click",function(e) {
            e = e || window.event;
            target = e.target || window.srcElement;
            console.log(inputTodo);
            bindEvent(inputTodo,"blur",function() {
                //失去焦点
                //获取input框内输入内容
                let content = inputTodo.value;
                //内容置空
                content.trim();
                if(content == "") {
                    return false;
                }
                inputTodo.value = "";
                //创建新的todo，新创建的todo默认未选中状态
                //创建新的todo，新创建的todo默认未选中状态
                let idx = (todoPage.idx)++;
                if(todoPage.userData.localData.length > 0) {
                    idx = todoPage.userData.localData[todoPage.userData.localData.length-1].idx+1;
                }
                let todo = new Todo(idx,content,"notcheck-status");
                todo.add();
            })
        })
        //全选
        let allBtn = getElement("#allBtn");
        bindEvent(allBtn,"click",function() {
            if(getElement("#count-box").innerText > 0) {
                console.log(33);
                for(let i = 0;i < todoPage.userData.localData.length;i++) {
                    todoPage.userData.localData[i].status = "check-status";
                }
            }else{
                for(let i = 0;i < todoPage.userData.localData.length;i++) {
                    todoPage.userData.localData[i].status = "notcheck-status";
                }
            }
            //更新localstorage中数据
            localStorage.setItem("todolist",JSON.stringify(todoPage.userData));
            todoPage.init();
        })
    }
}
// 子todo
//     *属性
//          内容
//          选中状态
//     *功能
//         初始化
//         改变完成状态
//             更新local中数据
//                 更改子todo的选中状态
//                 更改数组的顺序已完成的放到后面
//                 剩余未完成数量
//         删除
//             删除local中对应的TODO数据    
//         渲染页面
function Todo(idx,content,status) {
    //todo的id值
    this.idx = idx;
    //todo的内容
    this.content = content;
    //todo的状态
    this.status = status;
}
//页面刷新渲染
Todo.prototype.flash = function() {
    let newTodo = {
            idx: this.idx,
            content: this.content,
            status: this.status
        };
        console.log("flash")
        this.creat();
        todoPage.init()
    }
//创建新todo
Todo.prototype.add = function() {
    // if(e.keycode == 13 || e.keycode == 9) {
        // let content = inputTodo.value;
    let newTodo = {
        idx: this.idx,
        content: this.content,
        status: this.status
    };
    todoPage.userData.localData = JSON.parse(localStorage.getItem("todolist")).localData;
    todoPage.userData.localData.push(newTodo);
    //更新localstorage中数据
    localStorage.setItem("todolist",JSON.stringify(todoPage.userData));
    //更新todo数量
    this.creat();
    todoPage.init();
}
Todo.prototype.creat = function(time) {
        console.log(88);
        //获取元素
        let todoUl = getElement("#todos");
        //创建节点
        let li = creatEle("li");
        let label = creatEle("label");
        let input = creatEle("input");
        let img = creatEle("img");
        let div = creatEle("div");
        let i = creatEle("i");
        // input.className = this.status;
        i.className = "iconfont icon-zhiding";
        i.id = "up";
        img.src = "images/del.png"
        input.type = "checkbox";
        input.className = "btnstyle";
        //添加input控件到label
        label.className = this.status;
        label.appendChild(input);
        img.className = "del-style";
        if(this.status == "notcheck-status") {
            div.className = "todo-text";
        }else if(this.status == "check-status") {
            div.className = "todo-text-del"
        }
        div.innerText = this.content;
        li.className = "listyle";
        li.setAttribute("data-idx",this.idx);
        // 给li添加子元素
        li.appendChild(label);
        li.appendChild(img);
        li.appendChild(i);
        li.appendChild(div);
        this.view(li,img);
        this.view(li,i);
        this.change(li);
        this.up(i);
        todoUl.appendChild(li);
}
//按钮的显示与隐藏
Todo.prototype.view = function(li,img) {
    bindEvent(li,"mouseover",function() {
        img.style.display = "block";
    })
    bindEvent(li,"mouseout",function() {
        img.style.display = "none";
    })
}
//控制已完成和未完成状态和双击修改
Todo.prototype.change = function(li) {
    //点击改变按钮状态
    bindEvent(li,"click",function(e) {
        e.preventDefault();
        e = e || window.event;
        let target = e.target || window.srcElement;
        let parent = target.parentNode; 
        let todoUl = getElement("#todos");
        console.log("change");
        if(target.className == "notcheck-status") {
            //更改状态
            for(let i = 0; i < todoPage.userData.localData.length; i++) {
                if(todoPage.userData.localData[i].idx == target.parentNode.getAttribute("data-idx")) {
                    // console.log("changestatus");
                    todoPage.userData.localData[i].status = "check-status";
                }
            }
            for(let i = 0;i < todoUl.children.length; i++) {
                if(todoUl.children[i].firstChild.className == "check-status") {
                    changeIdx = todoUl.children[i].getAttribute("data-idx");
                    todoUl.insertBefore(parent,todoUl.children[i]);
                    break;
                }else {
                    todoUl.appendChild(li);
                }
            }
            //更新todo数据
            localStorage.setItem("todolist",JSON.stringify(todoPage.userData));
            //更新计数盒子
            footer.init();
            target.className = "check-status";
            //获取到兄弟div
            let sibingDiv = target.parentNode.lastChild;
            //给兄弟div添加删除线
            sibingDiv.className = "todo-text-del";
        }else if(target.className == "check-status") {
            //更改状态
            for(let i = 0; i < todoPage.userData.localData.length; i++) {
                if(todoPage.userData.localData[i].idx == target.parentNode.getAttribute("data-idx")) {
                    todoPage.userData.localData[i].status = "notcheck-status";
                }
            }
            for(let i = 0;i < todoUl.children.length; i++) {
                if(todoUl.children[i].firstChild.className == "check-status") {
                    changeIdx = todoUl.children[i].getAttribute("data-idx");
                    todoUl.insertBefore(parent,todoUl.children[i]);
                    break;
                }else {
                    todoUl.appendChild(li);
                }
            }
            //更新todo数据
            localStorage.setItem("todolist",JSON.stringify(todoPage.userData));
            //更新计数盒子
            footer.init();
            target.className = "notcheck-status";
            //获取到兄弟div
            let sibingDiv = target.parentNode.lastChild;
            //给兄弟div添加删除线
            sibingDiv.className = "todo-text";
        }
        let todos = getElement("#todos");
        for(let i = 0;i < todos.length; i++) {
            console.log(77);
            if(todos[i] != target) {
                let value = todos[i].lastChild.innerText;
                let div = creatEle('div');
                input.innerText = value;
                div.className = todos[i].lastChild.className;
                parent.removeChild(todos[i]);
                parent.appendChild(div);
                parent.firstChild.style.display = "none";
            }
        }
    })
    bindEvent(li,"dblclick",function(e) {
        e = e || window.event;
        let target = e.target || window.srcElement; 
        console.log("db")
        let parent = target.parentNode;
        if(target.tagName == "DIV" || target.tagName == "INPUT") {
            let parent = target.parentNode;
            //将div变为input
            if(target.tagName == "DIV") {
                let value = target.innerText;
                let input = creatEle('input');
                input.value = value;
                input.className = target.className;
                parent.removeChild(target);
                parent.appendChild(input);
                parent.firstChild.style.display = "none";
                parent.lastChild.focus();
            }
            parent.lastChild.onblur = function(e) {
                e = e || window.event;
                let target = e.target || window.srcElement; 
                let parent = target.parentNode;
                let value = target.value;
                let div = creatEle('div');
                div.innerText = value;
                div.className = target.className;
                //修改local中数据
                for(let i = 0;i < todoPage.userData.localData.length;i++){
                    if(todoPage.userData.localData[i].idx == parent.getAttribute("data-idx")) {
                        todoPage.userData.localData[i].content = value;
                    }
                }
                localStorage.setItem("todolist",JSON.stringify(todoPage.userData));
                parent.removeChild(target);
                parent.appendChild(div);
                parent.firstChild.style.display = "block";
            }
        }
    })
    bindEvent(li,"keydown",function(e) {
        e = e || window.event;
        let target = e.target || window.srcElement;
        console.log("key");
        let parent = target.parentNode;
        if(e.keyCode == 13 || e.keyCode == 9) {
            let value = target.value;
            console.log(target);
            //修改local中数据
            for(let i = 0;i < todoPage.userData.localData.length;i++){
                if(todoPage.userData.localData[i].idx == parent.getAttribute("data-idx")) {
                    todoPage.userData.localData[i].content = value;
                }
            }
            localStorage.setItem("todolist",JSON.stringify(todoPage.userData));
            let div = creatEle('div');
            div.innerText = value;
            div.className = target.className;
            parent.removeChild(target);
            parent.appendChild(div);
            parent.firstChild.style.display = "block";
        }
    })
}
Todo.prototype.up = function(ele) {
    bindEvent(ele,"click",function() {
        ele.style.display = "block";
    })
}
//  底栏
//      属性
//          未完成数量
//          按钮选中目标
//          清除按钮是否出现
//      功能
//          筛选功能
//              点击all显示全部todo
//              点击active显示未完成的todo
//              点击completed显示已完成todo
//          清除功能
//              清空local中已完成数据
//              更改剩余未完成数量
//          渲染页面 };
let footer = {
    num: 0,
    btn: "all",
    init() {
        this.num = 0;
        let itemCount = getElement("#count-box");
        for(let i = 0;i < todoPage.userData.localData.length;i++) {
            if(todoPage.userData.localData[i].status == "notcheck-status") {
                this.num++;
            }
        }
        itemCount.innerText = this.num;
        let clearBtn = getElement("#clear-complete");
        if(this.num < todoPage.userData.localData.length) {
            clearBtn.style.display = "block";
        }else {
            clearBtn.style.display = "none";
        }
        this.view(this.num);
        this.filtrate();
        this.clear();
    },
    view() {
        let footerBox = getElement(".footer-box");
        if(todoPage.userData.localData.length > 0) {
            footerBox.style.display = "block";
        }else {
            footerBox.style.display = "none";
        }
    },
    //清空已完成todo
    clear() {
        let clearBtn = getElement("#clear-complete");
        let delList = [];
        bindEvent(clearBtn,"click",function() {
            console.log("complete");
            for(let i = 0;i < todoPage.userData.localData.length;i++) {
                if(todoPage.userData.localData[i].status == "check-status") {
                    delList.push(todoPage.userData.localData[i].idx);
                }
            }
            for(let i = delList.length-1;i >= 0 ;i--) {
                for(let k = 0; k < todoPage.userData.localData.length;k++) {
                    if(todoPage.userData.localData[k].idx == delList[i]) {
                        todoPage.userData.localData.splice(k,1);
                    }
                }
            } 
            localStorage.setItem("todolist",JSON.stringify(todoPage.userData));
            todoPage.init();
        })
    },
    //筛选
    filtrate() {
        let filBtn = getElement("#filtrate");
        let filBtns = filBtn.children;
        //排他
        function current(list) {
            for(let i = 0;i < list.length; i++) {
                list[i].className ="";
            } 
        }
        //过滤
        let todos = getElement("#todos").children;
        function filter(data,status) {
            // 不传入参数代全部显示
            if(!status) {
                for(let i = 0;i < data.length;i++) {
                    data[i].style.display = "block";
                }     
            }else{
                for(let i = 0;i < data.length;i++) {
                    if(data[i].firstChild.className == status) {
                        data[i].style.display = "block";
                    }else {
                        data[i].style.display = "none";
                    }
                }
            } 
        }
        // console.log(filBtns);
        bindEvent(filBtn,"click",function(e) {
            e = e || window.event;
            target = e.target || window.srcElement;
            console.log("filBtn");
            switch(target.id) {
                case "all":
                    let all = getElement("#all");
                    current(filBtns);
                    filter(todos);
                    all.className = "btn-current";
                    break;
                case "active":
                    let active = getElement("#active");
                    current(filBtns);
                    filter(todos,"notcheck-status");
                    active.className = "btn-current";
                    break;
                case "complete":
                    let complete = getElement("#complete");
                    current(filBtns);
                    filter(todos,"check-status")
                    complete.className = "btn-current";
                    break;
            } 
        })
    }
}
//页面初始化
todoPage.init()
creatTodo.init();
footer.init();