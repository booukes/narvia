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
        const rx = ((y - cy) / cy) * 1.5;
        const ry = ((x - cx) / cx) * 1.2;

        cardRef.value.style.transition = 'transform 0.05s ease-out';
        cardRef.value.style.transform = `rotateX(${-rx}deg) rotateY(${ry}deg)`;
    };

    const handleLeave = () => {
        if (!cardRef.value) return;
        cardRef.value.style.transform = "none";
    };

    onMounted(() => {
        window.addEventListener("mousemove", handleMove);
        window.addEventListener("mouseleave", handleLeave);
    });

    onUnmounted(() => {
        window.removeEventListener("mousemove", handleMove);
        window.removeEventListener("mouseleave", handleLeave);
    });

    return { handleMove, handleLeave };
}
