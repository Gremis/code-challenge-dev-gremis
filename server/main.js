import { Meteor } from 'meteor/meteor';
import { Communities } from '../communities/communities';
import { People } from '../people/people';
import { loadInitialData } from '../infra/initial-data';

Meteor.startup(async () => {
  // DON'T CHANGE THE NEXT LINE
  await loadInitialData();

  // YOU CAN DO WHATEVER YOU WANT HERE
  Meteor.publish('communities', () => Communities.find());

  Meteor.publish('people', () => People.find());
});

Meteor.methods({
  'people.checkIn': async (personId) => {
    try {
      if (typeof personId !== 'string') {
        throw new Meteor.Error('Invalid ID', 'The person ID should be a string.');
      }

      const person = await People.findOneAsync(personId);
      if (!person) {
        throw new Meteor.Error('Person not found', `Person with ID ${personId} not found`);
      }

      const now = new Date();
      await People.updateAsync(personId, {
        $set: {
          checkInDate: now,
          checkOutDate: null,
        },
      });
      Meteor._debug(`Checked in person with ID ${personId} at ${now}`);
    } catch (error) {
      console.error('Error updating check-in:', error);
      throw new Meteor.Error('Error updating check-in', error.message);
    }
  },

  'people.checkOut': async (personId) => {
    try {
      if (typeof personId !== 'string') {
        throw new Meteor.Error('Invalid ID', 'The person ID should be a string.');
      }

      const person = await People.findOneAsync(personId);
      if (!person) {
        throw new Meteor.Error('Person not found', `Person with ID ${personId} not found`);
      }

      const now = new Date();
      await People.updateAsync(personId, {
        $set: {
          checkOutDate: now,
        },
      });
      Meteor._debug(`Checked out person with ID ${personId} at ${now}`);
    } catch (error) {
      console.error('Error updating check-out:', error);
      throw new Meteor.Error('Error updating check-out', error.message);
    }
  },

  'people.resetAll': async () => {
    try {
      await People.updateAsync(
        {},
        {
          $set: {
            checkInDate: null,
            checkOutDate: null,
          },
        },
        { multi: true }
      );
      Meteor._debug('All check-in and check-out records have been reset');
    } catch (error) {
      console.error('Error resetting records:', error);
      throw new Meteor.Error('Error resetting records', error.message);
    }
  },
});
