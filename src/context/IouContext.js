import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  addPerson,
  getAllPeople,
  deletePerson,
  addIou,
  getIousByPerson,
  settleIou,
  deleteIou,
  getAllPeopleWithBalances,
  getOverallIouSummary,
} from '../database/db';

const IouContext = createContext(null);

export const IouProvider = ({ children }) => {
  const [people, setPeople] = useState([]);
  const [iouSummary, setIouSummary] = useState({ owedToYou: 0, youOwe: 0 });

  // Refresh the people list (with balances) and overall summary
  const refreshPeople = useCallback(() => {
    setPeople(getAllPeopleWithBalances());
    setIouSummary(getOverallIouSummary());
  }, []);

  const createPerson = useCallback((person) => {
    const id = addPerson(person);
    refreshPeople();
    return id;
  }, [refreshPeople]);

  const removePerson = useCallback((id) => {
    deletePerson(id);
    refreshPeople();
  }, [refreshPeople]);

  const createIou = useCallback((iou) => {
    addIou(iou);
    refreshPeople();
  }, [refreshPeople]);

  const markIouSettled = useCallback((id) => {
    settleIou(id);
    refreshPeople();
  }, [refreshPeople]);

  const removeIou = useCallback((id) => {
    deleteIou(id);
    refreshPeople();
  }, [refreshPeople]);

  // Not stored in state — called on-demand from PersonDetailScreen
  // since it depends on which person is currently open
  const fetchIousForPerson = useCallback((personId) => {
    return getIousByPerson(personId);
  }, []);

  const value = {
    people,
    iouSummary,
    refreshPeople,
    createPerson,
    removePerson,
    createIou,
    markIouSettled,
    removeIou,
    fetchIousForPerson,
  };

  return (
    <IouContext.Provider value={value}>
      {children}
    </IouContext.Provider>
  );
};

export const useIous = () => {
  const context = useContext(IouContext);
  if (!context) {
    throw new Error('useIous must be used within an IouProvider');
  }
  return context;
};