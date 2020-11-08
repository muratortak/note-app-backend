const sinon = require('sinon');

const CreateInitialNote = require('../../Application/UseCases/Note/CreateInitialNote');
const GetAllNotes = require('../../Application/UseCases/Note/GetAllNotes');
const UpdateNote = require('../../Application/UseCases/Note/UpdateNote');
const DeleteNote = require('../../Application/UseCases/Note/DeleteNote');

describe('Note Use Cases', () => {
    it('should call createInitialNote', async() => {
        const userid = 0;
        const MockModel = {
            createInitialNote: sinon.spy()
        };
        await new CreateInitialNote(MockModel).createInitialNote(userid);
        const expected = true;
        const actual = MockModel.createInitialNote.calledOnce;
        expect(actual).toEqual(expected);
    });

    it('should call deleteNote', async() => {
        const user = {};
        const MockModel = {
            delete: sinon.spy()
        };
        await new DeleteNote(MockModel).deleteNote(user);
        const expected = true;
        const actual = MockModel.delete.calledOnce;
        expect(actual).toEqual(expected);
    });

    it('should call getAllNote', async() => {
        const user = {};
        const MockModel = {
            getAll: sinon.spy()
        };
        await new GetAllNotes(MockModel).getAllNotes(user);
        const expected = true;
        const actual = MockModel.getAll.calledOnce;
        expect(actual).toEqual(expected);
    });

    it('should call updateNote', async() => {
        const user = {};
        const MockModel = {
            update: sinon.spy()
        };
        await new UpdateNote(MockModel).updateNote(user);
        const expected = true;
        const actual = MockModel.update.calledOnce;
        expect(actual).toEqual(expected);
    });

});
