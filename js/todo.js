
    let  inputTodo = getElement("#input-todo");//todo输入框
    let  todos = getElement("#todos");//todo列表的ul
    let  footerBox = getElement(".footer-box");//底部按钮盒子
    let  allBtn = getElement("#allBtn");//全选按钮
    let  filtrate = getElement("#filtrate");//底部按钮ul
    let  countBox = getElement("#count-box");//计数盒子
    let  clearBtn = getElement("#clear-complete")//清空按钮
    let mtLocalstorage = window.localStorage;
    let todoArray = [];
    let startId = 0;
    let delNum = 0;//删除数量
    let dataObj = {
        data:[],
        delNum:0,
        allselect: "false",
        upStatus: false
    }
    function todoNum() {
        let todosChilds = todos.children;
        let num = 0;
        for(let i = 0; i < todosChilds.length; i++) {
            let sta = todosChilds[i].getAttribute("data-status"); 
            if(sta == 'no-check') {
                num++;
            }
        }
        countBox.innerText = num;
    }
    //根据localstorage里面的数据初始化页面
    if(!localStorage.getItem('todolist')) {
        todoArray = dataObj.data;//储存localstorage的todo数据
    }else {
        todoArray = JSON.parse(localStorage.getItem('todolist')).data;
        show(allBtn);
        show(footerBox);
        for(let i = 0;i < todoArray.length; i++) {
            let content = todoArray[i].content;
            let status = todoArray[i].status;
            let id = i;
            let upStatus = todoArray[i].upStatus;
            creatTree(content,status,id,upStatus,false);
            todoNum();
        }
        let localtodo = JSON.parse(localStorage.getItem('todolist'));
        let allselect = localtodo.allselect;
        console.log(allselect);
        //判断全选状态，根据localstora里面是否全选，改变全选按钮样式
        if(allselect == 'true'){
            allBtn.src = "images/arrowlight.png";
        }else if(allselect == 'false'){
            allBtn.src = "images/arrowdark.png";
        }
        //恢复筛选按钮选中状态
        // if()
        //根据页面上的left item数目初始化，clearBtn的状态
        if(countBox.innerText < todos.children.length){
            clearBtn.style.display = 'blcak';
        }else if(countBox.innerText ==  todos.children.length) {
            clearBtn.style.display = 'none';
        }
    }
    //todo数量更新函数
    function creatTree(content,status,id,upStatus,flash) {
        let li = creatEle("li");
        let btn = creatEle("input");
        let label = creatEle("label");
        let div = creatEle("div");
        let i = creatEle("i");
        i.className = "iconfont icon-zhiding";
        i.id = "up";
        let delBtn = creatEle("img");
        delBtn.src = 'images/del.png'
        delBtn.className = 'del-style';
        //给创建的元素添加内容
        div.innerText = content;
        btn.type = "checkbox";
        btn.className = "btnstyle";
        btn.id = status;
        if(upStatus == true) {
            li.className = "listyle-up"
            i.style.display = "block";
        }else if(upStatus == false) {
            li.className = "listyle"
        }
        if(status == 'check') {
            label.className = 'check-status';
            div.className = "todo-text-del";
        }else if(status == 'no-check'){
            label.className = 'notcheck-status';
            div.className = "todo-text";
        }
        label.appendChild(btn);
        li.appendChild(label);
        li.appendChild(delBtn);
        li.appendChild(i);
        li.appendChild(div);
        //刷新时创建
        if(flash == false && id != null) {    
            li.id = id;
        }
        //非刷新创建
        if(flash == true) {
            if(localStorage.getItem('todolist')) {
                startId = JSON.parse(localStorage.getItem('todolist')).data.length + JSON.parse(localStorage.getItem('todolist')).delNum;
            }
            console.log(startId);
            li.id = startId++;  
        }
        if(status === 'check') {
            li.setAttribute('data-status','check');
        }else {
            li.setAttribute('data-status','no-check')
        }
        // todos.appendChild(li);
        //添加todo到已完成的前面
        if(todos.children.length > 0) {
            for(let i = 0; i < todos.children.length; i++) {
                if(todos.children[i].getAttribute("data-status") == "check") {
                    todos.insertBefore(li,todos.children[i]);
                    break; 
                }else {
                    todos.appendChild(li);
                }
            }
        }else{
            todos.appendChild(li);
        }
    }
    function appendNode() {
        //获取value的值
        let value = inputTodo.value;
        if (value === "") {
            return  ;
        }
        let text = value;
        inputTodo.value = '';
        creatTree(text,'no-check',null,false,true);
      
        show(footerBox);
        show(allBtn);
        todoNum();
       
        if(countBox.innerText == 0){
            allBtn.src = "images/arrowlight.png";
        }else if(countBox.innerText > 0){
            allBtn.src = "images/arrowdark.png";
        }
        //存储创建的todo到localstorage
        console.log(todos.lastChild);
        if(localStorage.getItem("todolist")) {
            let localTodo = JSON.parse(localStorage.getItem("todolist"));
            let newTodo = {id: todos.children.length-1+localTodo.delNum,content:text,status:'no-check',upStatus:false};
            let inputPosition = localTodo.data.length;
            for(let i = 0;i < localTodo.data.length; i++) {
                if(localTodo.data[i].status == "check") {
                    inputPosition = i;
                }
            }
            localTodo.data.splice(inputPosition,0,newTodo);
            // localTodo.data.push({id: todos.children.length-1+localTodo.delNum,content:text,status:'no-check',upStatus:false});
            localStorage.setItem('todolist',JSON.stringify(localTodo));
        }else {
            let newTodo = {id: 0,content:text,status:'no-check',upStatus:false};
            todoArray.push(newTodo);
            console.log("diyi");
            dataObj.data = todoArray;
            localStorage.setItem('todolist',JSON.stringify(dataObj));
        }
    }
    //创建todo
        inputTodo.onkeydown = function (e) {
        if (e.keyCode === 13 || e.keyCode === 9) {
            appendNode();//添加todo
            todoNum();//查询元素个数
            for(let i = 0;i < filtrate.children.length;i ++) {
                if(filtrate.children[i].className === 'btn-current' && filtrate.children[i].id === 'complete') {
                    console.log(2);
                    filtrate.children[i].className = "btn-current";
                    for(let i =0;i < todos.children.length; i++) {
                        filtrateNode(todos.children[i],'data-status','check');
                    }
                }
                
            }
        }
        if(countBox.innerText == 0){
            clearBtn.style.display = 'block';
        }else if(countBox.innerText > 0) {
            clearBtn.style.display = 'none';
        }
    };
    inputTodo.onblur = function () {
        appendNode();
        todoNum();//检查为完成todo的数量
    };
    //完成todo或者未完成todo
    todos.onclick = function (e) {
        e  = e || window.event;
        let target = e.target || e.srcElement;
        if (target.className === "notcheck-status" ) {
            target.className = "check-status";
            let localTodo = localStorage.getItem('todolist');
            let todoObjs = JSON.parse(localTodo);
            let parent = target.parentNode;
            parent.className = "listyle";
            parent.lastChild.className = "todo-text-del";
            //使按钮显示
            // target.parentNode.children[2].style.display = "none";
            let firstFinsh = 0;//第一个已完成的位置
            //遍历找第一个已完成的位置
            for(let i = 0; i < todos.children.length; i++) {
                if(todos.children[i].getAttribute("data-status") == "check") {
                    firstFinsh = i;
                    break; 
                }else {
                    firstFinsh = todos.children.length-1;
                }
            }
            //更改li的选中状态
            parent.setAttribute("data-status","check");
            //更改li上的标识
            target.parentNode.setAttribute('data-status','check');
            parent.lastChild.className = "todo-text-del";
            console.log(todos.children);
            let currentId = [].indexOf.call(todos.children,parent);//当前元素 的索引值
            console.log(currentId);
            //更改todo的status状态
            todoObjs.data[currentId].upStatus = false;
            todoObjs.data[currentId].status = "check";
            //交换两数据的位置
            //使完成的todo放到下面          
            if(firstFinsh == todos.children.length-1) {
                // exchange(firstFinsh,currentId,todoObjs.data);
                todoObjs.data.push(todoObjs.data.splice(currentId,1)[0]);
                todos.appendChild(todos.children[currentId]);
            }else {
                // exchange(firstFinsh,currentId,todoObjs.data);
                todoObjs.data.push(todoObjs.data.splice(currentId,1)[0]);
                // todoObjs.data.splice(currentId-1,0,todoObjs.data.splice(currentId,1)[0]);
                todos.appendChild(todos.children[currentId]);
            }
            //更新数据
            localStorage.setItem('todolist',JSON.stringify(todoObjs));
            //如果当前按钮处于active状态，隐藏刚刚完成的todo
            for(let i = 0;i < filtrate.children.length;i ++) {
                if(filtrate.children[i].className === 'btn-current' && filtrate.children[i].id === 'active') {
                    hide(target.parentNode);
                }
            }
            todoNum();
            //判断是否已经完成所有的todo，如果是则clearBtn状态改变
            if(countBox.innerText == 0){
                console.log(99);
                clearBtn.style.display = 'none';
                let locodata = localStorage.getItem('todolist');
                locodata.allselect = true;
                localStorage.setItem("todolist",locodata);
            }else if(countBox.innerText > 0) {
                clearBtn.style.display = 'block';
                let locodata = localStorage.getItem('todolist');
                locodata.allselect = false;
                localStorage.setItem("todolist",locodata);
            }
        }else if (target.className === "check-status" ) {
            target.className = "notcheck-status";
            target.parentNode.setAttribute('data-status','no-check');
            target.parentNode.lastChild.className = "todo-text";
            //当前元素的id
            let localTodo = localStorage.getItem('todolist');
            let todoObjs = JSON.parse(localTodo);
            let parent = target.parentNode;
            // target.parentNode.children[2].style.display = "block";
            parent.lastChild.className = "todo-text";
            parent.className = "listyle";
            let firstFinsh = 0;//第一个已完成的位置
            parent.setAttribute("data-status","no-check");
            //遍历找第一个已完成的位置
            for(let i = 0; i < todos.children.length; i++) {
                if(todos.children[i].getAttribute("data-status") == "check") {
                    firstFinsh = i;
                    break; 
                }else {
                    firstFinsh = todos.children.length-1;
                }
            }
            //更改选中状态
            console.log(firstFinsh);
            parent.setAttribute("data-status","no-check");
            let currentId = [].indexOf.call(todos.children,parent);//当前元素 的索引值
             //更改todo的status状态
            todoObjs.data[currentId].status = "no-check";
            todoObjs.data[currentId].upStatus = false;
            console.log(currentId);
            //更新状态       
            for(let i = 0;i < todoObjs.data.length;i++) {
                todoObjs.data[currentId].status = 'no-check';
            }
            //位置修改 
            if(firstFinsh == todos.children.length-1) {
                todos.appendChild(parent);
                todoObjs.data.push(todoObjs.data.splice(currentId-1,1)[0]);
            }else {
                todos.insertBefore(parent,todos.children[firstFinsh]);
                todoObjs.data.splice(firstFinsh,0,todoObjs.data.slice(currentId,currentId+1)[0]);
                todoObjs.data.splice(currentId+1,1);
            }
            localStorage.setItem('todolist',JSON.stringify(todoObjs));
            todoNum();
            //判断是否已经完成所有的todo，如果是则clearBtn状态改变
            if(countBox.innerText == 0){
                clearBtn.style.display = 'none';
                let locodata = localStorage.getItem('todolist');
                locodata.allselect = true;
                localStorage.setItem("todolist",locodata);
            }else if(countBox.innerText > 0) {
                clearBtn.style.display = 'block';
                let locodata = localStorage.getItem('todolist');
                locodata.allselect = false;
                localStorage.setItem("todolist",locodata);
            }
        }
        //显示删除按钮
    
        if(target.tagName === 'DIV') {
            let parentBrothers = sibling(target);//获取目标元素的父级兄弟元素集合
            let inputs = [];
            let parent = target.parentNode;
            parent.firstChild.style.display = 'block'; 
            for(let i = 0;i < parentBrothers.length; i++) {
                if(parentBrothers[i].children[2].tagName === 'INPUT') {
                    inputs.push(parentBrothers[i].children[2]);//得到所有兄弟input
                }
                parentBrothers[i].firstChild.style.display = 'block';
            }
            //如果还有其他选中，使其input变回div
            if(inputs.length > 0) {
                for(let k = 0;k < inputs.length;k++) {
                    inputToDiv(inputs[k]);
                } 
            }
        }
    };
    // todo双击修改
      //make input -->div
    function inputToDiv(eve) {
        console.log(11);
        let value = eve.value;
        let div = creatEle('div');
        div.innerText = value;
        let parent = eve.parentNode;
        div.className = eve.className;
        parent.removeChild(eve);
        parent.appendChild(div);
    } 
    todos.ondblclick = function(e) {
        e  = e || window.event;
        let target = e.target || e.srcElement;
        // let childs = todos.children;
        if (target.className === "todo-text" ) {
            if(target.tagName === 'INPUT') {
                return;//如果是已经变成input推出执行
            }
            if(target.tagName === 'DIV') {
                let parentBrothers = sibling(target);//获取目标元素的父级兄弟元素集合
                let inputs = [];
                for(let i = 0;i < parentBrothers.length; i++) {
                    if(parentBrothers[i].children[2].tagName === 'INPUT') {
                        inputs.push(parentBrothers[i].children[2]);//得到所有兄弟input
                    }
                }
                //如果还有其他选中，使其input变回div
                if(inputs.length > 0) {
                    for(let k = 0;k < inputs.length;k++) {
                        inputToDiv(inputs[k]);
                    } 
                }
                let value = target.innerText ;
                let parent = target.parentNode;
                parent.firstChild.style.display = 'none'; 
                let targetClass = target.className;
                let input = creatEle('input');
                input.type = 'text';
                input.className = targetClass;
                input.value = value;
                parent.removeChild(target);
                parent.appendChild(input);
                parent.lastChild.focus();
                //给加入的input添加失去焦点事件
                parent.lastChild.onblur = function() {
                    parent.firstChild.style.display = 'block'; 
                    inputToDiv(parent.lastChild);
                    if(parent.lastChild.innerText.trim() ==="") {
                        delLocalTodo(nondeIndexOf(todos,parent));//删除localstorage的todo
                        parent.parentNode.removeChild(parent);
                    }
                }
                todoNum();
            }
        }
    }
    //完成修改
    todos.onkeydown = function(e) {
        // console.log(e.target.tagName);
        e  = e || window.event;
        let target = e.target || e.srcElement;
        if(target.tagName = 'INPUT') {
            target.onkeydown = function(eve) {
                    if(eve.keyCode === 13 || eve.keyCode === 9) {
                        target.blur();
                    }
                }
            target.onblur = function() {
                let parent = target.parentNode;
                parent.firstChild.style.display = 'block'; 
                inputToDiv(target);
                if(parent.lastChild.innerText =='') {
                    let todoId = nondeIndexOf(todos,parent);
                    delLocalTodo(todoId);//删除localstorage的todo
                    parent.parentNode.removeChild(parent);
                }
            }
        }
    }
    //删除todo
    function delLocalTodo(todoId) {
        let localTodo = JSON.parse(localStorage.getItem('todolist'));
        localTodo.data.splice(todoId,1);
        delNum++;
        localTodo.delNum = delNum;
        localStorage.setItem('todolist',JSON.stringify(localTodo));
    }
    todos.addEventListener('mouseover',function(e){
        e  = e || window.event;
        let target = e.target || e.srcElement;
        if(target.tagName === 'DIV' || target.tagName ==='LABEL') {
            let parent = target.parentNode;
            parent.children[1].style.display = 'block';
        }else if(target.tagName === 'LI') {
            target.children[1].style.display = 'block';
        }else if(target.tagName === 'IMG') {
            target.style.display = 'block';
            target.onclick = function() {
                let delLi = target.parentNode;
                let parent = delLi.parentNode;
                let todoId =nondeIndexOf(todos,delLi);
                delLocalTodo(todoId);
                parent.removeChild(delLi);
                todoNum();
            }
        }else if(target.tagName === "I") {
            let parent = target.parentNode;
            let firstFinsh = 0;
            //获取当前元素索引值
            let currentId = [].indexOf.call(todos.children,parent);
            target.onclick = function() {
                //样式修改&顺序调换
               if(parent.className === "listyle") {
                   let localTodo = JSON.parse(localStorage.getItem('todolist'));
                   let data = localTodo.data;
                   if(data[currentId].status == "check") {
                       return false;
                   }else {
                       target.style.display = "block";
                   }
                    parent.className = "listyle-up";
                    data[currentId].upStatus = true;   
                    data.unshift(data.splice(currentId,1)[0]);
                    todos.insertBefore(parent,todos.children[0]);
                    localStorage.setItem("todolist",JSON.stringify(localTodo));
               }
               else if(parent.className === "listyle-up") {
                    target.style.display = "";
                    parent.className = "listyle";
                    let localTodo = JSON.parse(localStorage.getItem('todolist'));
                    let data = localTodo.data;
                    data[currentId].upStatus = false;
                    //获取第一个完成的索引值
                    for(let i = 0; i < todos.children.length; i++) {
                        if(todos.children[i].getAttribute("data-status") == "check") {
                            firstFinsh = i;
                            break; 
                        }else {
                            firstFinsh = todos.children.length-1;
                        }
                    }
                    //元素回到第一个已完成的顶部        
                    if(firstFinsh == todos.children.length-1) {
                        // exchange(firstFinsh,currentId,todoObjs.data);
                        data.push(data.splice(currentId,1)[0]);
                        todos.appendChild(todos.children[firstFinsh]);
                    }else {
                        todos.insertBefore(parent,todos.children[firstFinsh]);
                        console.log(3333);
                        data.splice(firstFinsh,0,data.slice(currentId,currentId+1)[0]);
                        data.splice(currentId,1);
                        // todos.insertBefore(todos.data[currentId],todos.children[firstFinsh]);
                    }
                    localStorage.setItem("todolist",JSON.stringify(localTodo));
               }
            }
        }   
    })
    // 鼠标移出隐藏显示按钮
    todos.addEventListener('mouseout',function(e){
        e  = e || window.event;
        let target = e.target || e.srcElement;
        if(target.tagName === 'DIV' || target.tagName ==='LABEL') {
            let parent = target.parentNode;
            parent.children[1].style.display = 'none';
        }else if(target.tagName === 'LI') {
            target.children[1].style.display = 'none';
        }
    })
    //按钮高亮&筛选功能
    function btnLight(id,target) {
        let localTodo = JSON.parse(localStorage.getItem('todolist'));
        switch(id) {
            case 'all':
                target.className = '';
                target.className = "btn-current";
                localTodo.btnStatus = "all";
                localStorage.setItem("todolist",JSON.stringify(localTodo));
                for(let i =0;i < todos.children.length; i++) {
                     show(todos.children[i]);
                 }
                break;
             case 'active':
                 target.className = '';
                 target.className = "btn-current";
                 localTodo.btnStatus = "active";
                 localStorage.setItem("todolist",JSON.stringify(localTodo));
                 for(let i =0;i < todos.children.length; i++) {
                     filtrateNode(todos.children[i],'data-status','no-check');
                 }
                 break;
             case 'complete': 
                 target.className = '';
                 target.className = "btn-current";
                 localTodo.btnStatus = "complete";
                 localStorage.setItem("todolist",JSON.stringify(localTodo));
                 for(let i =0;i < todos.children.length; i++) {
                     filtrateNode(todos.children[i],'data-status','check');
                 }
                 break;
         }       
    }
    function todoFilter(e) {
        e = e || window.event;
       let target = e.target || e.srcElement;
       let id = target.id;
       let btns = filtrate.children;
       for(let i = 0;i < btns.length;i++) {
           btns[i].className = '';
       }
       btnLight(id,target);
    }
    filtrate.onclick = todoFilter;
    //全选
    allBtn.onclick = function() {
        todoNum();
        let todosChilds = todos.children;
        if(countBox.innerText > 0) {
            for(let i = 0;i < todosChilds.length;i++) {
                todosChilds[i].setAttribute("data-status","check");
                todosChilds[i].firstChild.className = "check-status";
                allBtn.src = "images/arrowlight.png"
                todosChilds[i].lastChild.className = "todo-text-del";
                let localTodos = JSON.parse(localStorage.getItem('todolist'));
                for(let k = 0;k < localTodos.length;k++) {
                    localTodos.data[k].status = 'check';
                    localTodos.data[k].allselect = 'true'
                }
                localStorage.setItem('todolist',JSON.stringify(localTodos));
                // localStorage.setItem('allselect',true);
            }
        }else if(countBox.innerText == 0) {
            for(let i = 0;i < todosChilds.length;i++) {
                todosChilds[i].setAttribute("data-status","no-check");
                todosChilds[i].firstChild.className = "notcheck-status";
                allBtn.src = "images/arrowdark.png";
                todosChilds[i].lastChild.className = "todo-text";
                let localTodos = JSON.parse(localStorage.getItem('todolist'));
                for(let k = 0;k < localTodos.length;k++) {
                    localTodos.data[k].status = 'no-check';
                    localTodos.data[k].allselect = 'false';
                }
                localStorage.setItem('todolist',JSON.stringify(localTodos));
                // localStorage.setItem('allselect',false);
                todoNum();
                
            }
        }
        //重新判断清除已完成按钮的状态
        if(countBox.innerText == 0){
            console.log(8);
            clearBtn.style.display = 'block';
        }else if(countBox.innerText > 0) {
            clearBtn.style.display = 'none';
        }      
    }
    //清空已完成
    clearBtn.onclick = function () {
        let childs = todos.children;
        let delId = [];
        let localTodo = JSON.parse(localStorage.getItem('todolist'));
        for(let i = 0;i < childs.length; i++) {
            if(childs[i].getAttribute("data-status") === "check") {
                delId.push(i);
            }
        }
        for(let k = delId.length-1;k >= 0; k--) {
            // 为了防止删除元素后长度改变，采用递减的方法来解决
            localTodo.data.splice(delId[k],1);
            localStorage.setItem('todolist',JSON.stringify(localTodo));
            todos.removeChild(childs[delId[k]]);
        }
        localTodo.delNum +=delId.length;
        localStorage.setItem('todolist',JSON.stringify(localTodo)); 
        todoNum();
        if(countBox.innerText == 0){
            clearBtn.style.display = 'none';
        }else if(countBox.innerText > 0) {
            console.log(22);
            clearBtn.style.display = 'block';
            upBtn.style.display = 'none';
        }
    }
