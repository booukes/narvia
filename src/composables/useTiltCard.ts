// useTiltCard.ts
import { onMounted, onUnmounted, Ref } from "vue";

export function useTiltCard(cardRef: Ref<HTMLElement | null>) {
    const handleMove = (ev: MouseEvent) => {
        if (!cardRef.value) return;
        const rect = cardRef.value.getBoundingClientRect();
        const x = ev.clientX - rect.left;
        const y = ev.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const rx = ((y - cy) / cy) * 1.8;
        const ry = ((x - cx) / cx) * 1.5;

        cardRef.value.style.transition = "transform 0.05s ease-out";
        cardRef.value.style.transform = `rotateX(${-rx}deg) rotateY(${ry}deg)`;

        // dynamically add shadow depending on angle
        const shadowX = -ry * 2;
        const shadowY = -rx * 4;
        cardRef.value.style.boxShadow = `${shadowX}px ${shadowY}px 40px rgba(255, 0, 255, 0.2)`;
    };

    const handleLeave = () => {
        if (!cardRef.value) return;
        cardRef.value.style.transition = "transform 0.5s ease, box-shadow 0.5s ease";
        cardRef.value.style.transform = "rotateX(0deg) rotateY(0deg)";
        cardRef.value.style.boxShadow = "0 0 40px rgba(255, 0, 80, 0.1)";
    };

    const shadowApply = () => {
        if (!cardRef.value) return;
        cardRef.value.style.transition = "box-shadow 0.3s ease-out";
        cardRef.value.style.boxShadow = "0 0 60px rgba(255, 0, 80, 0.3)";
    };

    onMounted(() => {
        // you were listening globally, but you only need to attach to the card
        if (!cardRef.value) return;
        window.addEventListener("mouseenter", shadowApply);
        window.addEventListener("mousemove", handleMove);
        window.addEventListener("mouseleave", handleLeave);
    });

    onUnmounted(() => {
        if (!cardRef.value) return;
        window.removeEventListener("mouseenter", shadowApply);
        window.removeEventListener("mousemove", handleMove);
        window.removeEventListener("mouseleave", handleLeave);
    });

    return { handleMove, handleLeave, shadowApply };
}
