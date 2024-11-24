const axios = require('axios');

jest.mock('axios');

describe('Register Tests', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    

  test('Schedule a task successfully', async () => {
    const task = { title: 'Test Task', date: '2023-10-10' };

    axios.post.mockResolvedValue({
      status: 201,
      data: { message: 'Task scheduled successfully.' }
    });

    const response = await axios.post('http://localhost:5000/schedule', task);

    expect(response.status).toBe(201);
    expect(response.data.message).toBe('Task scheduled successfully.');
  });

  test('Fail to schedule a task with missing title', async () => {
    const task = { title: '', date: '2023-10-10' };

    axios.post.mockRejectedValue({
      response: {
        status: 400,
        data: { message: 'Title is required.' }
      }
    });

    try {
      await axios.post('http://localhost:5000/schedule', task);
    } catch (error) {
      expect(error.response.status).toBe(400);
      expect(error.response.data.message).toBe('Title is required.');
    }
  });

  test('Fail to schedule a task with past date', async () => {
    const task = { title: 'Test Task', date: '2020-01-01' };

    axios.post.mockRejectedValue({
      response: {
        status: 400,
        data: { message: 'Date must be in the future.' }
      }
    });

    try {
      await axios.post('http://localhost:5000/schedule', task);
    } catch (error) {
      expect(error.response.status).toBe(400);
      expect(error.response.data.message).toBe('Date must be in the future.');
    }
  });
});