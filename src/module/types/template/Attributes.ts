import { SR5 } from "@/module/config";
import { ModifiableValue } from "./Base";
import { ModifiableField } from "../fields/ModifiableField";
const { NumberField, BooleanField, StringField } = foundry.data.fields;

export const AttributeField = (limit?: keyof typeof SR5.limits) => ({
    ...ModifiableValue(),
    hidden: new BooleanField(),
    label: new StringField({ required: true }),
    limit: new StringField({
        blank: true,
        readonly: true,
        ...(limit ? { initial: limit } : {}),
        choices: limit ? { [limit]: SR5.limits[limit] } : SR5.limits,
    }),
});

const EdgeAttributeField = () => ({
    ...AttributeField(),
    uses: new NumberField({ required: true, nullable: false, integer: true, initial: 0, min: 0 }),
    max: new NumberField({ required: true, nullable: false, integer: true, initial: 0, min: 0 }),
});

// 무한성광류 TRPG: 9 attributes in 3 categories
// 신체 (Body): 근력(body), 민첩(agility), 건강(reaction)
// 정신 (Mind): 지능(strength), 통찰(willpower), 정신(logic)
// 교류 (Social): 매력(intuition), 조작(charisma), 냉정(edge)
export const Attributes = () => ({
    body: new ModifiableField(AttributeField("physical")),       // 근력 (Strength) - 신체
    agility: new ModifiableField(AttributeField("physical")),    // 민첩 (Agility) - 신체
    reaction: new ModifiableField(AttributeField("physical")),   // 건강 (Health) - 신체
    strength: new ModifiableField(AttributeField("mental")),     // 지능 (Intelligence) - 정신
    willpower: new ModifiableField(AttributeField("mental")),    // 통찰 (Insight) - 정신
    logic: new ModifiableField(AttributeField("mental")),        // 정신 (Spirit) - 정신
    intuition: new ModifiableField(AttributeField("social")),    // 매력 (Charisma) - 교류
    charisma: new ModifiableField(AttributeField("social")),     // 조작 (Manipulation) - 교류
    magic: new ModifiableField(AttributeField("mental")),
    resonance: new ModifiableField(AttributeField("mental")),
    essence: new ModifiableField(AttributeField()),

    edge: new ModifiableField(EdgeAttributeField()),             // 냉정 (Composure) - 교류
});

// MatrixActorAttributes are all the attributes an actor should have to work in the matrix
// this was going to be named MatrixAttributes but that's taken...
export const MatrixActorAttributes = () => ({
    attack: new ModifiableField(AttributeField("attack")),
    sleaze: new ModifiableField(AttributeField("sleaze")),
    data_processing: new ModifiableField(AttributeField("data_processing")),
    firewall: new ModifiableField(AttributeField("firewall")),

    rating: new ModifiableField(AttributeField()),
})

export const TechnologyAttributes = () => ({
    willpower: new ModifiableField(AttributeField("mental")),
    logic: new ModifiableField(AttributeField("mental")),
    intuition: new ModifiableField(AttributeField("mental")),
    charisma: new ModifiableField(AttributeField("social")),
    ...MatrixActorAttributes(),
});

export type AttributesType = foundry.data.fields.SchemaField.InitializedData<ReturnType<typeof Attributes>>;
export type AttributeFieldType = foundry.data.fields.SchemaField.InitializedData<ReturnType<typeof AttributeField>>;
export type EdgeAttributeFieldType = foundry.data.fields.SchemaField.InitializedData<ReturnType<typeof EdgeAttributeField>>;
export type TechnologyAttributesType = foundry.data.fields.SchemaField.InitializedData<ReturnType<typeof TechnologyAttributes>>;
