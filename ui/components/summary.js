import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { People } from '../../people/people';

const Summary = ({ selectedEvent }) => {
    const people = useTracker(() => People.find({ communityId: selectedEvent }).fetch(), [selectedEvent]);

    const peopleInEvent = people.filter(person => person.checkInDate && !person.checkOutDate).length;
    const peopleNotCheckedIn = people.filter(person => !person.checkInDate).length;

    const peopleByCompany = people
        .filter(person => person.checkInDate && !person.checkOutDate)
        .reduce((acc, person) => {
            acc[person.companyName] = (acc[person.companyName] || 0) + 1;
            return acc;
        }, {});

    return (
        <div className="mt-4">
            <p>People in the event right now: {peopleInEvent}</p>
            <p>People by company in the event right now: {Object.entries(peopleByCompany).map(([company, count]) => `${company} (${count})`).join(', ')}</p>
            <p>People not checked in: {peopleNotCheckedIn}</p>
        </div>
    );
};

export { Summary };