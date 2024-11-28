<template>
    <header class="flex justify-between border-b border-slate-200 px-10 py-8">
        <div class="flex items-center gap-4">
            <RouterLink
                class="flex items-center gap-3 cursor-pointer"
                :to="{ name: 'home' }"
            >
                <img src="/logo.png" alt="Logo" class="w-11" />
                <div>
                    <h2 class="font-bold text-xl uppercase">Vue Sneakers</h2>
                    <p class="text-slate-400">Магазин лучших кроссовок</p>
                </div>
            </RouterLink>
        </div>

        <ul class="flex items-center gap-10">
            <li
                class="flex items-center gap-3 cursor-pointer"
                @click="emit('openDrawer')"
            >
                <img src="/cart.svg" alt="Cart" />
                <b>{{ cart.summ }} руб.</b>
            </li>
            <RouterLink
                class="flex items-center gap-3 cursor-pointer"
                :to="{ name: 'favorites' }"
            >
                <img src="/heart.svg" alt="Favorite" />
                <span>Закладки</span>
            </RouterLink>
            <li class="flex items-center gap-3 cursor-pointer">
                <img src="/profile.svg" alt="Favorite" />
                <span>Профиль</span>
            </li>
        </ul>
    </header>
</template>

<script setup>
import { defineEmits } from "vue";
import { RouterLink } from "vue-router";
import { useCartStore } from "@/stores/cart";

const cart = useCartStore();

const emit = defineEmits(["openDrawer"]);
defineProps(["cartSumm"]);
</script>
