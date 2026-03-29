"use client";

import { EditButton } from "@/components/shared/edit-button";
import { useDrawerState } from "@/components/shared/drawer-state-provider";

export function HeroEditButton() {
 const { openDrawer } = useDrawerState();
 return <EditButton onClick={() => openDrawer("profile")} />;
}

export function ExperienceEditButton() {
 const { openDrawer } = useDrawerState();
 return <EditButton onClick={() => openDrawer("cv-experience")} />;
}

export function EducationEditButton() {
 const { openDrawer } = useDrawerState();
 return <EditButton onClick={() => openDrawer("cv-education")} />;
}

export function SkillEditButton() {
 const { openDrawer } = useDrawerState();
 return <EditButton onClick={() => openDrawer("cv-skill")} />;
}
