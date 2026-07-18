export { Store } from '../../pages/Store';
export { SmartDoorProduct } from '../../pages/SmartDoorProduct';
export { NovaQuestMiniProduct } from '../../pages/NovaQuestMiniProduct';
export {
  novaQuestMiniProduct,
  smartDoorProduct,
  storeProducts,
} from '../../data/storeProducts';

export const storeModuleRoutes = [
  { path: '/store', label: 'Store listing' },
  { path: '/store/smart-door', label: 'Engineering Smart Door' },
  { path: '/store/nova-quest-mini', label: 'Nova Quest Mini' },
] as const;
