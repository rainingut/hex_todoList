// 操作常用的 DOM 元素前，將 DOM 元素存在變數裡，不要直接從 window 裡取
const addForm    = document.getElementById('addForm');
const addBtn     = document.getElementById('addBtn');
const tagForm    = document.getElementById('tagForm');
const myul       = document.getElementById('myul');
const footer     = document.getElementById('footer');
const countItems = document.getElementById('countItems');

let datas = JSON.parse(localStorage.getItem('todoList')) || [];
let renderData = [];
let currentTag = 'all';

function localStorageHandler(data){
  localStorage.clear();
  localStorage.setItem('todoList', JSON.stringify(data));
}

function addItemHandler(data){
  const obj = {
    id:    new Date().getTime(),
    state: 'undone',
    name:  data
  }
  datas.push(obj);
  filterDataHandler(currentTag);
  addForm.reset();
}

function deleteItemHandler(data){
  let idx;
  datas.map((item,index)=>{
    if (item.id == data.dataset.num) idx = index
  })
  datas.splice(idx, 1);
  filterDataHandler(currentTag);
}

function changeItemStateHandeler(data){
  datas.forEach((item,index,arr)=>{
    if (item.id == data.dataset.num) {
      data.checked ? item.state = 'done' : item.state = 'undone';
    }
  })
  filterDataHandler(currentTag);
}

function filterDataHandler(state){
  localStorageHandler(datas);
  renderData = [];
  if (state === 'all') renderData = [...datas];
  else renderData = datas.filter(item=> item.state === state );
  renderDataHandler();
}

function renderDataHandler(){
  // 主要內容
  let str = ''
  renderData.map(item=>{
    // class="${item.state=='done'?'done':'undone'}"
    str += `
        <li>
          <label data-num="${item.id}">
            <input type="checkbox"data-num="${item.id}" ${item.state=='done'?'checked':''}>
            <span>${item.name}</span>
          </label>
          <button data-num="${item.id}">×</button>
        </li>
        `
  });
  myul.innerHTML = str;
  
  // footer
  const undoneNum = datas.filter(item=>item.state==='undone').length
  const doneNum = datas.filter(item=>item.state==='done').length
  const btn = footer.querySelector('button');
  countItems.textContent = `　${undoneNum}　個待完成項目`
  if(doneNum>0)  btn.style.visibility = 'initial'; 
  else btn.style.visibility = 'hidden';
}

function changeTagHandler(state){
  currentTag = state;
  filterDataHandler(currentTag);
}

function clearDoneDataHandler(){
  datas = datas.filter((item)=> item.state !== 'done' );
  filterDataHandler(currentTag);
}

filterDataHandler(currentTag);

/*
  Q：請問<form>裡面的<button>按下Enter後有沒有辦法可以預防表單送出呢
  A：你目前的 button 有設 type=“button” 就不會觸發 submit 行為
     你遇到的問題是 input 的 submit，可以把表單的預設行為取消掉就不會觸發了
*/
document.querySelectorAll('form').forEach(item=>{
  item.addEventListener('submit',e=>{e.preventDefault();})
})

addForm.item.addEventListener('keyup', (e) => {
  if(e.keyCode === 13 && addForm.item.value.trim()) addItemHandler(addForm.item.value)
})
addBtn.addEventListener('click',(e)=>{e.preventDefault();
 if(addForm.item.value.trim()) addItemHandler(addForm.item.value)
})

myul.addEventListener('click', (e)=>{
  if(e.target.nodeName==='BUTTON') {deleteItemHandler(e.target) }
  else if(e.target.type==='checkbox') {changeItemStateHandeler(e.target)}
})

tagForm.addEventListener('click', (e)=>{
  changeTagHandler(tagForm.tag.value);
})

footer.querySelector('button').addEventListener('click', clearDoneDataHandler)