### 使用

假设有如下HTML

```html
  <ul class="todo-list">
    <li>
      <div class="todo">todo 1 content</div>
      <ul class="operations">
        <a class="delete" href="#" data-rel="/todos/1">删除</a>
      </ul>
    </li>
    <li>
      <div class="todo">todo 2 content</div>
      <ul class="operations">
        <a href="#" data-rel="/todos/2">删除</a>
      </ul>
    </li>
  </ul>
```

调用如下JS就可以了，这是委托的方式

```javascript
  $(".todo-list li").deletable({
    toggle: ".operations a.delete", 
    delegateTo: "ul.todo-list", 
    deleteItem: "li"
  });
```

也可以不采用委托的方式, 事件直接监听在元素上


```javascript
  $(".todo-list li").deletable({toggle: ".operations a.delete"});
```
