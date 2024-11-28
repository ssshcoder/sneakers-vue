import { ref, computed, onMounted } from "vue";
import { defineStore } from "pinia";
import axios from "axios";

export const useCartStore = defineStore('cart', ()=> {

    const items = ref([])

    const summ = computed(()=>{
        let summ =  items.value.reduce(function(sum, item){
            return sum + (Number(String(item.price).replace("$", "")) * item.count);
        }, 0)
        return summ
    })

    const tax = computed(()=>Math.round(summ.value * 0.05))

    const fetchCartItems = async () => {
        try {
            const { data } = await axios.get(
                "https://13c40ac57bcc6a80.mokky.dev/items",
                {
                    params: {
                        inCart: true,
                    },
                }
            );
            items.value = data;
        } catch (error) {
            console.error("Error fetching:", error.message);
        }
    };
    function addToCart(item){

        if(!items.value.some(i=> i.id === item.id)){ 
            item.count = 1
            items.value.push(item) 
            try {
                const { data } = axios.patch(
                    "https://13c40ac57bcc6a80.mokky.dev/items/" + item.id,
                    {
                        inCart: true,
                        count: 1
                    }
                );
            } catch (error) {
                console.error("Error adding in cart:", error.message);
            }
        } 
        
        
    }
    function deleteFromCart(id){
        items.value.forEach((item)=> {
            if(item.id === id){ // если id совпадает, соответственно удаляем элемент
                item.count = 0
                items.value = items.value.filter(item => item.id !== id)
                try {
                    const { data } = axios.patch(
                        "https://13c40ac57bcc6a80.mokky.dev/items/" + id,
                        {
                            inCart: false,
                            count: 0
                        }
                    );
                    console.log(data);
                } catch (error) {
                    console.error("Error patching:", error.message);
                }
            } 
        })
    }
    function clearCart(){
        const ids = items.value.map(item => item.id)
        items.value = []
        ids.forEach((id)=> {
            try {
                const { data } = axios.patch(
                    "https://13c40ac57bcc6a80.mokky.dev/items/" + id,
                    {
                        inCart: false,
                        count: 0
                    }
                );
                console.log(data);
            } catch (error) {
                console.error("Error clear cart:", error.message);
            }
        })
    }
    function createOrder(){
        if(items.value.length !== 0){
            try {
                const { data } = axios.post(
                    "https://13c40ac57bcc6a80.mokky.dev/orders",
                    {
                        items: items.value,
                        totalPrice: summ.value,
                        date: new Date()
                    }
                );
                console.log(data);
                clearCart()
            } catch (error) {
                console.error("Error creating order:", error.message);
            }
        } else {
            alert("Корзина пуста")
        }
    }
    onMounted(fetchCartItems)

    return {summ, tax, items, deleteFromCart, addToCart,fetchCartItems, clearCart, createOrder}

})
