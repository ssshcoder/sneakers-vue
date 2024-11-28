<template>
    <div
        class="relative flex flex-col w-full border border-slate-100 rounded-xl p-8 cursor-pointer transition hover:shadow-xl hover:transform hover:-translate-y-2"
    >
        <div @click="clickOnFavorite" class="absolute top-8 left-8">
            <img :src="favImg" alt="Favorite" />
        </div>
        <img :src="img" class="w-full" alt="Sneaker" />
        <p>{{ title }}</p>
        <div class="flex justify-between mt-5">
            <div class="flex flex-col gap-2">
                <span class="text-slate-200">Цена:</span>
                <span class="font-bold">{{ price }} </span>
            </div>
            <img
                :src="item.inCart ? '/checked.svg' : '/plus.svg'"
                alt="Card"
                @click="
                    cart.addToCart(item);
                    $emit('clickAddToCart', item);
                "
            />
        </div>
        <img :src="logo" :alt="logo" />
    </div>
</template>

<script setup>
import { computed } from "vue";
import { useCartStore } from "@/stores/cart";

const cart = useCartStore();

const props = defineProps({
    title: String,
    price: String,
    img: String,
    logo: String,
    isFavorite: Boolean,
    item: Object,
});

const emit = defineEmits(["clickOnFavorite", "clickAddToCart"]);

const favImg = computed(() =>
    props.isFavorite ? "/like-2.svg" : "/like-1.svg"
);

function clickOnFavorite() {
    console.log("add to favorite");
    emit("clickOnFavorite");
}
</script>
