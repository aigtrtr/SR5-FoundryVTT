import { SR5 } from "@/module/config";
import { ModifiableValue } from "./Base";
import { ModifiableField } from "../fields/ModifiableField";
import { FixedTypeObjectField } from "../fields/FixedTypeObjectField";
const { SchemaField, BooleanField, ArrayField, NumberField, StringField, TypedObjectField, HTMLField } = foundry.data.fields;

export type SkillCategories = 'active' | 'language' | 'knowledge';

export const SkillField = () => ({
    ...ModifiableValue(),
    name: new StringField({ required: true }),
    img: new StringField({ required: true }),
    description: new HTMLField({ required: true }),
    hidden: new BooleanField(),
    label: new StringField({ required: true }),
    attribute: new StringField({
        blank: true,
        required: true,
        choices: SR5.attributes
    }),
    _delete: new BooleanField(), // Does it use it?
    specs: new ArrayField(new StringField({ required: true })),
    canDefault: new BooleanField({ initial: true }),
    isNative: new BooleanField({ initial: false }), // this only actually applies to language skills
    id: new StringField({ required: true }),
    link: new StringField({ required: true }),
    group: new StringField({ required: true }),
    bonus: new ArrayField(new SchemaField({
        key: new StringField({ required: true }),
        value: new NumberField({ required: true, nullable: false, integer: true, initial: 0 }),
    })),
});

function skill(createData: foundry.data.fields.SchemaField.CreateData<ReturnType<typeof SkillField>> = {}) {
    const initialValue = new ModifiableField(SkillField()).getInitialValue(createData);
    return foundry.utils.mergeObject(initialValue, createData);
}

// Use FixedTypeObjectField to allow for DataField.applyChange to work on skills.
// See class documentation for more information.
// 무한성광류 TRPG Skills: 신체(Body)/정신(Mind)/교류(Social)/기타(Other)
export const Skills = () => new FixedTypeObjectField(
    new ModifiableField(SkillField()),
    {
        required: true,
        initial: {
            // 신체 (Body) Skills
            gymnastics: skill({ attribute: 'agility', group: 'Body', id: 'gymnastics' }),         // 운동 (Athletics)
            unarmed_combat: skill({ attribute: 'body', group: 'Body', id: 'unarmed_combat' }),     // 격투 (Combat)
            pilot_ground_craft: skill({ attribute: 'agility', group: 'Body', id: 'pilot_ground_craft' }), // 운전 (Driving)
            pistols: skill({ attribute: 'agility', group: 'Body', id: 'pistols' }),                // 총기 (Firearms)
            locksmith: skill({ attribute: 'agility', group: 'Body', id: 'locksmith' }),            // 손재주 (Dexterity)
            sneaking: skill({ attribute: 'agility', group: 'Body', id: 'sneaking' }),              // 은폐 (Stealth)
            survival: skill({ attribute: 'reaction', group: 'Body', id: 'survival' }),             // 생존 (Survival)
            blades: skill({ attribute: 'body', group: 'Body', id: 'blades' }),                     // 백병전 (Melee)

            // 정신 (Mind) Skills
            arcana: skill({ attribute: 'strength', group: 'Mind', id: 'arcana' }),                 // 학식 (Knowledge)
            computer: skill({ attribute: 'strength', group: 'Mind', id: 'computer' }),             // 컴퓨터 (Computer)
            artisan: skill({ attribute: 'strength', group: 'Mind', id: 'artisan' }),               // 수공예 (Craft)
            perception: skill({ attribute: 'strength', group: 'Mind', id: 'perception' }),         // 수사 (Investigation)
            medicine: skill({ attribute: 'strength', group: 'Mind', id: 'medicine' }),             // 의학 (Medicine)
            spellcasting: skill({ attribute: 'logic', group: 'Mind', id: 'spellcasting' }),        // 신비학 (Occult)
            hardware: skill({ attribute: 'strength', group: 'Mind', id: 'hardware' }),             // 과학 (Science)

            // 교류 (Social) Skills
            animal_handling: skill({ attribute: 'intuition', group: 'Social', id: 'animal_handling' }),   // 동물 교감 (Animal Empathy)
            assensing: skill({ attribute: 'intuition', group: 'Social', id: 'assensing' }),        // 감수성 (Sensitivity)
            performance: skill({ attribute: 'intuition', group: 'Social', id: 'performance' }),    // 표현 (Expression)
            intimidation: skill({ attribute: 'charisma', group: 'Social', id: 'intimidation' }),   // 협박 (Intimidation)
            etiquette: skill({ attribute: 'charisma', group: 'Social', id: 'etiquette' }),         // 사교 (Socializing)
            disguise: skill({ attribute: 'charisma', group: 'Social', id: 'disguise' }),           // 위장 (Disguise)

            // 기타 (Other) Skills
            con: skill({ attribute: 'charisma', group: 'Other', id: 'con' }),                      // 기타1 (Other 1)
            negotiation: skill({ attribute: 'charisma', group: 'Other', id: 'negotiation' }),      // 기타2 (Other 2)
        }
    }
);

console.log(Skills().getInitialValue());

export const KnowledgeSkillList = (initialAttribute: string) => ({
    attribute: new StringField({
        required: true,
        initial: initialAttribute,
        choices: ["strength", "logic", "intuition", "charisma"]
    }),
    value: new TypedObjectField(new ModifiableField(SkillField()), {required: true, initial: {}}),
});

export const KnowledgeSkills = () => ({
    street: new SchemaField(KnowledgeSkillList('intuition')),
    academic: new SchemaField(KnowledgeSkillList('strength')),
    professional: new SchemaField(KnowledgeSkillList('strength')),
    interests: new SchemaField(KnowledgeSkillList('intuition')),
});

// Not yet implemented in fvtt-types curently
export type SkillsType = Record<string, SkillFieldType>;
export type SkillFieldType = foundry.data.fields.SchemaField.InitializedData<ReturnType<typeof SkillField>>;
export type KnowledgeSkillsType = foundry.data.fields.SchemaField.InitializedData<ReturnType<typeof KnowledgeSkills>>;

export type KnowledgeSkillCategory = keyof ReturnType<typeof KnowledgeSkills>;
