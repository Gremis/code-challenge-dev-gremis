import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { EventSelector } from './components/eventSelector';
import { PeopleList } from './components/peopleList';
import { Summary } from './components/summary';

export const App = () => {
  const [selectedEvent, setSelectedEvent] = useState('');

  const handleResetAll = () => {
    Meteor.call('people.resetAll', (error) => {
      if (error) {
        Meteor._debug(`Error resetting records: ${error.message}`);
      } else {
        Meteor._debug('All records have been reset successfully');
      }
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-lg font-bold">Event Check-in</h1>
      <div className="flex justify-between items-center my-4">
        <EventSelector selectedEvent={selectedEvent} setSelectedEvent={setSelectedEvent} />
        <button
          className="bg-red-500 text-white py-1 px-4 rounded"
          onClick={handleResetAll}
        >
          Reset All
        </button>
      </div>
      {selectedEvent && (
        <>
          <Summary selectedEvent={selectedEvent} />
          <PeopleList selectedEvent={selectedEvent} />
        </>
      )}
    </div>
  );
};
