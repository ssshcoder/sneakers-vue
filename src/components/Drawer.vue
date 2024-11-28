<template>
    <div
        class="fixed z-10 top-0 h-full w-full bg-black opacity-70"
        @click="$emit('closeDrawer')"
    />
    <div
        class="flex flex-col justify-between fixed h-full z-10 top-0 h-full right-0 w-96 bg-white px-10 py-7"
    >
        <h2 class="text-2xl font-bold mb-10 flex items-center gap-5">
            <button class="p-2" @click="$emit('closeDrawer')">
                <svg
                    class="rotate-180 hover:-translate-x-1 opacity-30 hover:opacity-100 transition cursor-pointer"
                    width="16"
                    height="14"
                    viewBox="0 0 16 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M1 7H14.7143"
                        stroke="black"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                    <path
                        d="M8.71436 1L14.7144 7L8.71436 13"
                        stroke="black"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
            </button>

            Корзина
        </h2>
        <div class="flex flex-col flex-1 justify-between" v-if="items.length">
            <CartList :items="items" @delete-cart-item="deleteFavorite" />

            <div>
                <div class="flex flex-col gap-5">
                    <div class="flex items-end gap-2">
                        <span>Итого:</span>
                        <div class="flex-1 border-b border-dashed" />
                        <span class="font-bold">{{ cart.summ }} руб.</span>
                    </div>

                    <div class="flex items-end gap-2">
                        <span>Налог 5%:</span>
                        <div class="flex-1 border-b border-dashed" />
                        <span class="font-bold">{{ cart.tax }} руб.</span>
                    </div>
                </div>

                <button
                    class="flex justify-center items-center gap-3 w-full py-3 mt-10 bg-lime-500 text-white rounded-xl transition active:bg-lime-700 hover:bg-lime-600"
                    @click="cart.createOrder"
                    :disabled="cart.items.length === 0"
                >
                    Оформить заказ
                    <img src="/arrow-next.svg" alt="Arrow" />
                </button>
            </div>
        </div>
        <div v-else class="flex flex-col flex-1 justify-center items-center">
            <img src="/package-icon.png" alt="" class="" />
            <div>Корзина пуста</div>
        </div>
    </div>
</template>

<script setup>
import { useCartStore } from "@/stores/cart";
import axios from "axios";
import { defineEmits, onMounted, ref, computed, watch } from "vue";
import CartList from "./CartList.vue";

const emit = defineEmits(["closeDrawer", "deleteCartItem"]);
const items = ref([]);
const cart = useCartStore();

const fetchFavorites = async () => {
    try {
        const { data } = await axios.get(
            "https://13c40ac57bcc6a80.mokky.dev/favorites"
        );
        items.value = data;
    } catch (error) {
        console.error("Error fetching:", error.message);
    }
};

const deleteFavorite = async (id, parentId) => {
    try {
        const { data } = await axios.delete(
            "https://13c40ac57bcc6a80.mokky.dev/favorites/" + id
        );
        items.value = items.value.filter((i) => i.id !== id);
    } catch (error) {
        console.error("Error deleting:", error.message);
    }
    try {
        emit("deleteCartItem", id, parentId);
        const { data } = await axios.patch(
            "https://13c40ac57bcc6a80.mokky.dev/items/" + parentId,
            {
                isFavorite: false,
            }
        );
        console.log(data);
        // items.value = data;
    } catch (error) {
        console.error("Error patching:", error.message);
    }
};

const loadCartItems = () => {
    items.value = cart.items;
};

watch(
    () => cart.items,
    () => {
        loadCartItems();
    },
    { deep: false }
);

onMounted(loadCartItems);
</script>
