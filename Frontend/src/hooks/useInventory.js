import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import {
  getAllInventory,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  updateStock,
  reset,
} from '../features/inventory/inventorySlice';

export const useInventory = () => {
  const dispatch = useDispatch();
  const { items, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.inventory
  );

  useEffect(() => {
    if (items.length === 0) {
      dispatch(getAllInventory());
    }
  }, [dispatch, items.length]);

  const createItem = async (itemData) => {
    return dispatch(createInventoryItem(itemData));
  };

  const updateItem = async (id, itemData) => {
    return dispatch(updateInventoryItem({ id, itemData }));
  };

  const deleteItem = async (id) => {
    return dispatch(deleteInventoryItem(id));
  };

  const updateItemStock = async (id, quantity) => {
    return dispatch(updateStock({ id, quantity }));
  };

  const refreshInventory = () => {
    dispatch(getAllInventory());
  };

  const resetState = () => {
    dispatch(reset());
  };

  return {
    items,
    isLoading,
    isError,
    isSuccess,
    message,
    createItem,
    updateItem,
    deleteItem,
    updateItemStock,
    refreshInventory,
    resetState,
  };
};
