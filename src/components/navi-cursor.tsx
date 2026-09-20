"use client";
import { useEffect, useRef } from "react";
import { NaviArt } from "./navi-art";

export function NaviCursor() {
  const ref = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = ref.current!;
    const trail = trailRef.current!;
    const fine = matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let idleTimer = 0;
    let pressTimer = 0;
    let x = 0,
      y = 0,
      dx = 0,
      dy = 0;

    function stopMoving() {
      node.dataset.moving = "false";
      trail.dataset.visible = "false";
    }
    function hide() {
      cancelAnimationFrame(frame);
      clearTimeout(idleTimer);
      clearTimeout(pressTimer);
      frame = 0;
      stopMoving();
      node.dataset.pressed = "false";
      node.dataset.visible = "false";
      document.documentElement.removeAttribute("data-navi");
    }
    function move(event: PointerEvent) {
      if (!fine.matches || event.pointerType !== "mouse") return hide();
      // Keep native caret/select behavior in editable controls.
      if (
        event.target instanceof Element &&
        event.target.closest("input, textarea, select, [contenteditable]")
      )
        return hide();
      dx = event.clientX - x;
      dy = event.clientY - y;
      x = event.clientX;
      y = event.clientY;
      node.dataset.hover = String(
        event.target instanceof Element &&
          !!event.target.closest("a, button, summary"),
      );
      if (!frame)
        frame = requestAnimationFrame(() => {
          node.style.transform = `translate3d(${x}px, ${y}px, 0)`;
          node.dataset.visible = "true";
          node.dataset.moving = String(!reduced.matches);
          // Only the faint afterimage lags. The real tip tracks the pointer exactly.
          const distance = Math.hypot(dx, dy) || 1;
          const offset = Math.min(distance, 10);
          trail.style.transform = `translate3d(${x - (dx / distance) * offset}px, ${y - (dy / distance) * offset}px, 0)`;
          trail.dataset.visible = String(!reduced.matches);
          document.documentElement.dataset.navi = "true";
          frame = 0;
          clearTimeout(idleTimer);
          idleTimer = window.setTimeout(stopMoving, 150);
        });
    }
    function press() {
      node.dataset.pressed = "true";
      clearTimeout(pressTimer);
      pressTimer = window.setTimeout(() => {
        node.dataset.pressed = "false";
      }, 240);
    }
    document.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerdown", press, { passive: true });
    document.addEventListener("pointerleave", hide);
    document.addEventListener("keydown", hide);
    window.addEventListener("blur", hide);
    fine.addEventListener("change", hide);
    reduced.addEventListener("change", hide);
    return () => {
      hide();
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerdown", press);
      document.removeEventListener("pointerleave", hide);
      document.removeEventListener("keydown", hide);
      window.removeEventListener("blur", hide);
      fine.removeEventListener("change", hide);
      reduced.removeEventListener("change", hide);
    };
  }, []);
  return (
    <>
      <div
        ref={trailRef}
        className="navi-trail"
        aria-hidden="true"
        data-visible="false"
      >
        <NaviArt id="navi-trail" />
      </div>
      <div
        ref={ref}
        className="navi-cursor"
        aria-hidden="true"
        data-visible="false"
      >
        <NaviArt id="navi-pointer" />
      </div>
    </>
  );
}
