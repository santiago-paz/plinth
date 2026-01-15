import type { Schema, Struct } from '@strapi/strapi';

export interface AreasRoom extends Struct.ComponentSchema {
  collectionName: 'components_areas_rooms';
  info: {
    description: 'A room with photos and video';
    displayName: 'Room';
    icon: 'house-user';
  };
  attributes: {
    name: Schema.Attribute.String & Schema.Attribute.Required;
    photos: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
    video: Schema.Attribute.Media<'videos' | 'files' | 'images' | 'audios'>;
  };
}

export interface ColorsColorItem extends Struct.ComponentSchema {
  collectionName: 'components_colors_color_items';
  info: {
    description: 'A single color with name and hex value';
    displayName: 'Color Item';
    icon: 'brush';
  };
  attributes: {
    hex: Schema.Attribute.String & Schema.Attribute.Required;
    name: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface PlansPlanItem extends Struct.ComponentSchema {
  collectionName: 'components_plans_plan_items';
  info: {
    description: 'A plan image with description';
    displayName: 'Plan Item';
    icon: 'map';
  };
  attributes: {
    description: Schema.Attribute.Text;
    picture: Schema.Attribute.Media<'images' | 'files'> &
      Schema.Attribute.Required;
  };
}

export interface SectionsAreas extends Struct.ComponentSchema {
  collectionName: 'components_sections_areas';
  info: {
    description: 'Areas section';
    displayName: 'Areas';
    icon: 'house-user';
  };
  attributes: {
    cover: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    list: Schema.Attribute.Component<'areas.room', true>;
    video: Schema.Attribute.Media<'videos' | 'files' | 'images' | 'audios'>;
  };
}

export interface SectionsColors extends Struct.ComponentSchema {
  collectionName: 'components_sections_colors';
  info: {
    description: 'Colors section';
    displayName: 'Colors';
    icon: 'paint-brush';
  };
  attributes: {
    description: Schema.Attribute.Text;
    palette: Schema.Attribute.Component<'colors.color-item', true>;
    video: Schema.Attribute.Media<'videos' | 'files' | 'images' | 'audios'>;
  };
}

export interface SectionsInspiration extends Struct.ComponentSchema {
  collectionName: 'components_sections_inspirations';
  info: {
    description: 'Inspiration section';
    displayName: 'Inspiration';
    icon: 'lightbulb';
  };
  attributes: {
    cover: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    gallery: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
    text: Schema.Attribute.RichText;
    video: Schema.Attribute.Media<'videos' | 'files' | 'images' | 'audios'>;
  };
}

export interface SectionsMaterials extends Struct.ComponentSchema {
  collectionName: 'components_sections_materials';
  info: {
    description: 'Materials section';
    displayName: 'Materials';
    icon: 'layer-group';
  };
  attributes: {
    description: Schema.Attribute.Text;
    gallery: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
    video: Schema.Attribute.Media<'videos' | 'files' | 'images' | 'audios'>;
  };
}

export interface SectionsPlans extends Struct.ComponentSchema {
  collectionName: 'components_sections_plans';
  info: {
    description: 'Plans section';
    displayName: 'Plans';
    icon: 'map';
  };
  attributes: {
    cover: Schema.Attribute.Media<'images'>;
    list: Schema.Attribute.Component<'plans.plan-item', true>;
    title: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'areas.room': AreasRoom;
      'colors.color-item': ColorsColorItem;
      'plans.plan-item': PlansPlanItem;
      'sections.areas': SectionsAreas;
      'sections.colors': SectionsColors;
      'sections.inspiration': SectionsInspiration;
      'sections.materials': SectionsMaterials;
      'sections.plans': SectionsPlans;
    }
  }
}
