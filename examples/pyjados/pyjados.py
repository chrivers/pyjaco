class TodosApp:
    list_item_template = """<li id="todo_%(id)s">
    <input type="checkbox"/>%(text)s
    </li>"""

    @JSVar("jQuery", "js_add_form", "js_checkbox", "js_stored_todos", "JSON")
    def __init__(self):
        js_add_form = jQuery(js("#add_todo_form"))
        js_add_form.submit(js(self.add_todo))
        js_checkbox = jQuery(js("input[type=checkbox]"))
        js_checkbox.live("click", js(self.complete_todo))
        self.todos = {}
        self.next_id = 1

        js_stored_todos = localStorage.getItem("todolist")

        if js_stored_todos:
            stored_dict = dict(py(JSON.parse(js_stored_todos)))
            self.todos = dict([(int(i), stored_dict[i]) for i in stored_dict.keys()])
            self.next_id = max(self.todos.keys()) + 1

        self.render()

    @JSVar("event", "js_add_box")
    def add_todo(self, js_event):
        js_add_box = jQuery(js("#add_box"))
        self.todos[self.next_id] = py(js_add_box.val())
        js_add_box.val('')
        js_add_box.focus()
        self.next_id += 1
        self.store()
        self.render()
        return js(False)

    @JSVar("event", "jQuery", "todo_item")
    def complete_todo(self, event):
        todo_item = jQuery(event.target).parent()
        id = int(py(todo_item.attr("id"))[5:])
        del self.todos[id]
        self.store()
        todo_item.delay(1500).fadeOut("slow")

    @JSVar("js_todo_items")
    def render(self):
        js_todo_items = jQuery(js("#todo_items"))
        js_todo_items.html("")
        for id, todo in sorted(self.todos.items()):
            js_todo_items.append(js(TodosApp.list_item_template % {
                "id": id,
                "text": todo}))

    @JSVar("localStorage", "JSON")
    def store(self):
        localStorage.setItem("todolist", JSON.stringify(js(self.todos)))

def setup():
    todo_app = TodosApp()

jQuery(js(setup));
