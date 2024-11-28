<template>
    <div
        class="relative flex w-full border border-slate-100 rounded-xl p-4 gap-4"
    >
        <img :src="img" class="w-16 h-16" alt="Sneaker" />
        <div class="flex flex-col w-full">
            <p>{{ title }}</p>
            <div class="flex justify-between mt-5">
                <span>Количество:</span>
                <span>{{ count }}</span>
            </div>
            <div class="flex justify-between mt-5">
                <span class="font-bold">{{ price }} руб.</span>
                <img
                    @click="cart.deleteFromCart(id)"
                    class="cursor-pointer opacity-30 hover:opacity-100 transition"
                    src="/close.svg"
                    alt="Удалить"
                    title="Удалить"
                />
            </div>
        </div>
    </div>
</template>

<script setup>
import { useCartStore } from "@/stores/cart";

const cart = useCartStore();

defineProps({
    title: String,
    price: String,
    img: String,
    id: Number,
    count: Number,
    parentId: Number,
});
const emit = defineEmits(["deleteCartItem"]);
</script>
