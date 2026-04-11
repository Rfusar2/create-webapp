type RouterElementRegister =  {
    element: HTMLElement;
    value?: string | number;
    id: string
}

class Render {
    register = []

    add(item: RouterElementRegister){ this.register.push(item) }
    
    update(id: string, value: string){
        for(const item of this.register){
            if(item.id == id){
                item.element.textContent = value
            }
        }
    }
}
const RENDER = new Render()
