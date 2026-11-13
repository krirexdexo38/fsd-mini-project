import React, { useRef, useState } from "react";
import { Minus, Plus, Users } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

const AVATAR_OVERLAP = 12;
const DICEBEAR_STYLE = "notionists-neutral";
const dicebearUrl = (seed) =>
  `https://api.dicebear.com/9.x/${DICEBEAR_STYLE}/svg?seed=${encodeURIComponent(
    seed
  )}&backgroundColor=f4f4f5,e4e4e7,d4d4d8,a1a1aa`;

const DEFAULT_MEMBERS = [
  { id: "member-1", name: "Team Lead", avatarUrl: dicebearUrl("Leader") },
  { id: "member-2", name: "Co-Developer", avatarUrl: dicebearUrl("Developer") },
  { id: "member-3", name: "Designer", avatarUrl: dicebearUrl("Designer") },
  { id: "member-4", name: "Presenter", avatarUrl: dicebearUrl("Presenter") },
  { id: "member-5", name: "Strategist", avatarUrl: dicebearUrl("Strategist") },
];

const animations = {
  avatar: {
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 22,
        mass: 0.6,
      },
    },
    hidden: {
      opacity: 0,
      scale: 0.85,
      transition: { duration: 0.18, ease: "easeOut" },
    },
  },
  vibration: {
    idle: { x: 0 },
    shake: {
      x: [-3, 3, -2, 2, 0],
      transition: { duration: 0.28, ease: "easeOut" },
    },
  },
};

export default function TeamSelector({
  members = DEFAULT_MEMBERS,
  defaultValue = 1,
  onChange,
  maxSize = 5,
  label = "Team Size",
  className = "",
}) {
  const effectiveMembers = members.slice(0, maxSize);
  const maxTeamSize = effectiveMembers.length;
  const [peopleCount, setPeopleCount] = useState(defaultValue);
  const [isVibrating, setIsVibrating] = useState(false);
  const directionRef = useRef(1);
  const prefersReducedMotion = useReducedMotion();

  const triggerVibration = () => {
    if (prefersReducedMotion) return;
    setIsVibrating(true);
    setTimeout(() => setIsVibrating(false), 280);
  };

  const handleIncrement = (e) => {
    e?.preventDefault();
    if (peopleCount < maxTeamSize) {
      directionRef.current = 1;
      const newCount = peopleCount + 1;
      setPeopleCount(newCount);
      onChange?.(newCount);
    } else {
      triggerVibration();
    }
  };

  const handleDecrement = (e) => {
    e?.preventDefault();
    if (peopleCount > 1) {
      directionRef.current = -1;
      const newCount = peopleCount - 1;
      setPeopleCount(newCount);
      onChange?.(newCount);
    } else {
      triggerVibration();
    }
  };

  const counterDistance = prefersReducedMotion ? 0 : 10;

  return (
    <div
      className={cn(
        "flex w-full flex-col items-center justify-center",
        className
      )}
    >
      <div className="w-full rounded-2xl border border-border bg-card p-5 shadow-xs">
        <fieldset>
          <div className="flex items-center justify-between mb-4">
            <legend className="font-bold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-primary" />
              <span>{label}</span>
            </legend>
            <span className="text-[11px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
              {peopleCount === 1 ? "Individual Entry" : `Team of ${peopleCount}`}
            </span>
          </div>

          <div className="mb-6 flex justify-center">
            <div className="flex items-center">
              {effectiveMembers.map((member, index) => (
                <motion.div
                  animate={index < peopleCount ? "visible" : "hidden"}
                  className="flex items-center justify-center"
                  initial={index < defaultValue ? "visible" : "hidden"}
                  key={member.id}
                  style={{
                    marginLeft: index === 0 ? 0 : -AVATAR_OVERLAP,
                    zIndex: maxTeamSize - index,
                  }}
                  variants={animations.avatar}
                >
                  <img
                    alt={member.name}
                    className="w-10 h-10 rounded-full border-2 border-card bg-muted object-cover shadow-sm ring-1 ring-border"
                    src={member.avatarUrl}
                    loading="lazy"
                  />
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            animate={isVibrating ? "shake" : "idle"}
            className="flex items-center justify-center gap-5"
            initial="idle"
            variants={animations.vibration}
          >
            <button
              aria-label="Decrease team size"
              className="flex w-9 h-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-all duration-150 hover:border-primary hover:text-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-40"
              disabled={peopleCount <= 1}
              onClick={handleDecrement}
              type="button"
            >
              <Minus aria-hidden="true" className="w-4 h-4" strokeWidth={2.5} />
            </button>

            <div className="flex min-w-16 flex-col items-center">
              <div className="relative h-9 overflow-hidden">
                <AnimatePresence initial={false} mode="popLayout">
                  <motion.output
                    animate={{ opacity: 1, y: 0 }}
                    aria-live="polite"
                    className="block select-none font-extrabold text-3xl text-foreground tabular-nums leading-none"
                    exit={{
                      opacity: 0,
                      y: directionRef.current * -counterDistance,
                      transition: { duration: 0.14, ease: "easeIn" },
                    }}
                    initial={{
                      opacity: 0,
                      y: directionRef.current * counterDistance,
                    }}
                    key={peopleCount}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    {peopleCount}
                  </motion.output>
                </AnimatePresence>
              </div>
              <span className="text-[11px] font-semibold text-muted-foreground">
                {peopleCount === 1 ? "member" : "members"}
              </span>
            </div>

            <button
              aria-label="Increase team size"
              className="flex w-9 h-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-all duration-150 hover:border-primary hover:text-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-40"
              disabled={peopleCount >= maxTeamSize}
              onClick={handleIncrement}
              type="button"
            >
              <Plus aria-hidden="true" className="w-4 h-4" strokeWidth={2.5} />
            </button>
          </motion.div>
        </fieldset>
      </div>
    </div>
  );
}
