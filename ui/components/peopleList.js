import React, { useState, useEffect } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { People } from '../../people/people';
import moment from 'moment';
import { Meteor } from 'meteor/meteor';

const PeopleList = ({ selectedEvent }) => {
    const [updateTrigger, setUpdateTrigger] = useState(false);

    // Use the useTracker hook to subscribe to the People collection
    const { people, isLoading } = useTracker(() => {
        const subscription = Meteor.subscribe('people');
        const loading = !subscription.ready();
        const peopleData = People.find({ communityId: selectedEvent }).fetch();
        return { people: peopleData, isLoading: loading };
    }, [selectedEvent, updateTrigger]);

    useEffect(() => {
        const interval = setInterval(() => {
            setUpdateTrigger(prev => !prev);
        }, 5000); // Force reactivity update every 5 seconds
        return () => clearInterval(interval); // Clear interval on component unmount
    }, []);

    const handleCheckIn = (personId) => {
        Meteor.call('people.checkIn', personId, (error) => {
            if (error) {
                console.error(`Error checking in: ${error.message}`);
            } else {
                setUpdateTrigger(!updateTrigger); // Force reactivity update
            }
        });
    };

    const handleCheckOut = (personId) => {
        Meteor.call('people.checkOut', personId, (error) => {
            if (error) {
                console.error(`Error checking out: ${error.message}`);
            } else {
                setUpdateTrigger(!updateTrigger); // Force reactivity update
            }
        });
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="mt-4">
            <table className="min-w-full bg-white border border-gray-200">
                <thead>
                    <tr className="bg-blue-100">
                        <th className="py-2 px-2 border-b border-gray-300 text-center text-blue-700">Full Name</th>
                        <th className="py-2 px-2 border-b border-gray-300 text-center text-blue-700">Company</th>
                        <th className="py-2 px-2 border-b border-gray-300 text-center text-blue-700">Title</th>
                        <th className="py-2 px-2 border-b border-gray-300 text-center text-blue-700">Check-in Date</th>
                        <th className="py-2 px-2 border-b border-gray-300 text-center text-blue-700">Check-out Date</th>
                        <th className="py-2 px-2 border-b border-gray-300 text-center text-blue-700">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {people.map((person, index) => (
                        <tr key={person._id} className={index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-50 hover:bg-gray-200'}>
                            <td className="py-2 px-2 border-b border-gray-300 text-center">{`${person.firstName} ${person.lastName}`}</td>
                            <td className="py-2 px-2 border-b border-gray-300 text-center">{person.companyName || 'unknow'}</td>
                            <td className="py-2 px-2 border-b border-gray-300 text-center">{person.title || 'unknow'}</td>
                            <td className="py-2 px-2 border-b border-gray-300 text-center">{person.checkInDate ? moment(person.checkInDate).format('MM/DD/YYYY, HH:mm') : 'N/A'}</td>
                            <td className="py-2 px-2 border-b border-gray-300 text-center">{person.checkOutDate ? moment(person.checkOutDate).format('MM/DD/YYYY, HH:mm') : 'N/A'}</td>
                            <td className="py-2 px-6 border-b border-gray-300 text-center">
                                <div className="flex justify-center space-x-2">
                                    {!person.checkInDate && (
                                        <button
                                            className="bg-blue-500 text-white py-1 px-4 rounded min-w-max"
                                            onClick={() => handleCheckIn(person._id)}
                                        >
                                            Check-in
                                        </button>
                                    )}
                                    {person.checkInDate && !person.checkOutDate && moment().diff(moment(person.checkInDate), 'seconds') > 5 && (
                                        <button
                                            className="bg-red-500 text-white py-1 px-4 rounded min-w-max"
                                            onClick={() => handleCheckOut(person._id)}
                                        >
                                            Check-out
                                        </button>
                                    )}
                                    {person.checkInDate && person.checkOutDate && (
                                        <span className="text-green-500 font-bold">Done</span>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export { PeopleList };
