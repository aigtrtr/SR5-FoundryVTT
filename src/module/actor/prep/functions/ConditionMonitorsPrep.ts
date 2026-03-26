import { SR5 } from "../../../config";

export class ConditionMonitorsPrep {
    /**
     * 무한성광류: 의지력 (Willpower) track = 정신(logic) + 냉정(edge)
     * Uses stun track to represent willpower points
     */
    static prepareStun(system: Actor.SystemOfType<'character' | 'spirit'>) {
        const { track, attributes, modifiers } = system;

        track.stun.base = attributes.logic.value + attributes.edge.value;
        track.stun.max = Math.max(1, track.stun.base + Number(modifiers.stun_track));
        track.stun.label = SR5.damageTypes.stun;
        track.stun.disabled = false;
    }

    /**
     * 무한성광류: 생명력 (Hit Points) = 건강(reaction) + 체적 보정(5 for medium)
     * Uses physical track to represent hit points
     */
    static preparePhysical(system: Actor.SystemOfType<'character' | 'spirit'>) {
        const { track, attributes, modifiers } = system;

        // 무한성광류: HP = Health(건강/reaction) + volume HP modifier (5 for medium creatures)
        const volumeHPModifier = 5;
        track.physical.base = attributes.reaction.value + volumeHPModifier;
        track.physical.max = Math.max(1, track.physical.base + Number(modifiers.physical_track));
        track.physical.overflow.max = attributes.reaction.value + Number(modifiers.physical_overflow_track);
        track.physical.label = SR5.damageTypes.physical;
        track.physical.disabled = false;
    }

    static prepareGrunt(system: Actor.SystemOfType<'character' | 'spirit'>) {
        // Grunts use only one monitor, use physical to get overflow functionality.
        ConditionMonitorsPrep.prepareStun(system);

        const { track, attributes, modifiers } = system;
        // Overwrite stun damage to avoid invisible damage modifiers.
        track.stun.value = 0;
        track.stun.disabled = true;

        // 무한성광류: Grunts use Health(건강/reaction) for their monitor
        const volumeHPModifier = 5;
        track.physical.base = attributes.reaction.value + volumeHPModifier;
        track.physical.max = Math.max(1, track.physical.base + Number(modifiers.physical_track));
        track.physical.overflow.max = attributes.reaction.value;
        track.physical.label = "SR5.ConditionMonitor";
        track.physical.disabled = false;
    }
}
