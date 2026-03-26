import { LimitRules } from './../../../rules/LimitRules';
import { PartsList } from '../../../parts/PartsList';
import { Helpers } from '../../../helpers';
import { SR5 } from "../../../config";

export class LimitsPrep {
    static prepareLimits(system: Actor.SystemOfType<'character' | 'spirit' | 'sprite' | 'vehicle'>) {
        const { limits, modifiers, special } = system;

        // Apply the actor local modifiers defined on the sheet.
        limits.physical.mod = PartsList.AddUniquePart(limits.physical.mod, 'SR5.Bonus', Number(modifiers['physical_limit']));
        limits.mental.mod = PartsList.AddUniquePart(limits.mental.mod, 'SR5.Bonus', Number(modifiers['mental_limit']));
        limits.social.mod = PartsList.AddUniquePart(limits.social.mod, "SR5.Bonus", Number(modifiers['social_limit']));
        
        // Determine if the astral limit is relevant.
        if ('astral' in limits)
            limits.astral.hidden = special !== 'magic';

        for (const [name, limit] of Object.entries(limits)) {
            Helpers.calcTotal(limit);
            limit.label = SR5.limits[name];
        }
    }

    static prepareLimitBaseFromAttributes(system: Actor.SystemOfType<'character' | 'spirit'>) {
        const { limits, attributes } = system;

        // 무한성광류: Limits derived from attributes
        // Physical limit → 기본 방어 (Base Defense) = min(민첩/agility, 통찰/willpower)
        limits.physical.base = Math.min(attributes.agility.value, attributes.willpower.value);
        // Mental limit → 감지 범위 기반 (Detection-based) = 통찰(willpower) * 2
        limits.mental.base = attributes.willpower.value * 2;
        // Social limit → 의지력 기반 (Willpower-based) = 정신(logic) + 냉정(edge)
        limits.social.base = attributes.logic.value + attributes.edge.value;
    }

    /**
     * Some limits are derived from others or must be caluclated last.
     */
    static prepareDerivedLimits(system: Actor.SystemOfType<'character' | 'spirit'>) {
        const {limits, modifiers, special, attributes} = system;

        if (special === 'magic') {
            // Astral limit.
            limits.astral = LimitRules.calculateAstralLimit(limits.astral, limits.mental, limits.social);
            limits.astral.mod = PartsList.AddUniquePart(limits.astral.mod, "SR5.Bonus", Number(modifiers['astral_limit']));
            Helpers.calcTotal(limits.astral);

            // Magic attribute as limit, hidden as it's directly derived from an attribute.
            limits.magic = LimitRules.calculateMagicLimit(attributes.magic);
            limits.magic.hidden = true;
            Helpers.calcTotal(limits.magic);
        }

        limits.initiation = LimitRules.calculateInitiationSubmersionLimit(system.magic.initiation)
        Helpers.calcTotal(limits.initiation, {min: 0});
    }
}
