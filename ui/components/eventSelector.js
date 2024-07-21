import React from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Communities } from '../../communities/communities';

const EventSelector = ({ selectedEvent, setSelectedEvent }) => {
    const communities = useTracker(() => Communities.find().fetch());

    return (
        <select
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
            className="mt-4 p-2 border rounded"
        >
            <option value="">Select an event</option>
            {communities.map((community) => (
                <option key={community._id} value={community._id}>
                    {community.name}
                </option>
            ))}
        </select>
    );
};

export { EventSelector };
