import { currentContent, type EquipmentFields } from '@/lib/site-content';
import { equipment as records } from './charging-data';
import { equipmentDetails } from './equipment-details';
import { equipmentSources } from './equipment-sources';

export const equipmentDefaults = records.map(({ id, brand, name, category, connector, power, uses }) => {
  const detail = equipmentDetails[id];
  const fields: EquipmentFields = {
    brand, name, category, connector, power, uses,
    description: detail.description,
    note: detail.note,
    image: '/equipment-photos/' + detail.source + '.webp',
    source: equipmentSources[detail.source],
    specs: detail.specs,
  };
  return { id, fields };
});

export const equipment = equipmentDefaults.map(({ id, fields }) => ({
  id,
  filterCategory: fields.category,
  ...fields,
  ...currentContent().equipment[id],
}));

