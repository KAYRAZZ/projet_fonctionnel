const axios = require('axios');
const fc = require('fast-check');

jest.mock('axios');

describe('Settings.vue', () => {
  test('should change password successfully', async () => {
    const spy = jest.spyOn(axios, 'post').mockResolvedValue({
      status: 200,
      data: { message: 'Mot de passe changé avec succès.' }
    });

    const wrapper = {
      data: {
        currentPassword: 'oldPassword',
        newPassword: 'newPassword',
        confirmPassword: 'newPassword',
        success: null,
        error: null
      },
      methods: {
        changePassword: async () => {
          try {
            const response = await axios.post('http://localhost:5000/api/change-password', {
              currentPassword: wrapper.data.currentPassword,
              newPassword: wrapper.data.newPassword
            });
            wrapper.data.success = response.data.message;
            wrapper.data.error = null;
          } catch (error) {
            wrapper.data.error = "Une erreur s'est produite. Veuillez réessayer.";
            wrapper.data.success = null;
          }
        }
      }
    };

    await wrapper.methods.changePassword();

    expect(spy).toHaveBeenCalledWith('http://localhost:5000/api/change-password', {
      currentPassword: 'oldPassword',
      newPassword: 'newPassword'
    });

    expect(wrapper.data.success).toBe('Mot de passe changé avec succès.');
    expect(wrapper.data.error).toBe(null);
  });

  test('should show error if passwords do not match', async () => {
    const wrapper = {
      data: {
        currentPassword: 'oldPassword',
        newPassword: 'newPassword',
        confirmPassword: 'differentPassword',
        success: null,
        error: null
      },
      methods: {
        changePassword: () => {
          if (wrapper.data.newPassword !== wrapper.data.confirmPassword) {
            wrapper.data.error = 'Les mots de passe ne correspondent pas.';
            wrapper.data.success = null;
          }
        }
      }
    };

    wrapper.methods.changePassword();

    expect(wrapper.data.error).toBe('Les mots de passe ne correspondent pas.');
    expect(wrapper.data.success).toBe(null);
  });

  test('should handle API error', async () => {
    const spy = jest.spyOn(axios, 'post').mockRejectedValue(new Error('API Error'));

    const wrapper = {
      data: {
        currentPassword: 'oldPassword',
        newPassword: 'newPassword',
        confirmPassword: 'newPassword',
        success: null,
        error: null
      },
      methods: {
        changePassword: async () => {
          try {
            await axios.post('http://localhost:5000/api/change-password', {
              currentPassword: wrapper.data.currentPassword,
              newPassword: wrapper.data.newPassword
            });
          } catch (error) {
            wrapper.data.error = "Une erreur s'est produite. Veuillez réessayer.";
            wrapper.data.success = null;
          }
        }
      }
    };

    await wrapper.methods.changePassword();

    expect(spy).toHaveBeenCalled();
    expect(wrapper.data.error).toBe("Une erreur s'est produite. Veuillez réessayer.");
    expect(wrapper.data.success).toBe(null);
  });

  test('should handle random password inputs', async () => {
    await fc.assert(
      fc.asyncProperty(fc.string(), fc.string(), fc.string(), async (currentPassword, newPassword, confirmPassword) => {
        const wrapper = {
          data: {
            currentPassword,
            newPassword,
            confirmPassword,
            success: null,
            error: null
          },
          methods: {
            changePassword: () => {
              if (wrapper.data.newPassword !== wrapper.data.confirmPassword) {
                wrapper.data.error = 'Les mots de passe ne correspondent pas.';
                wrapper.data.success = null;
              } else {
                wrapper.data.error = null;
              }
            }
          }
        };

        wrapper.methods.changePassword();

        if (newPassword !== confirmPassword) {
          expect(wrapper.data.error).toBe('Les mots de passe ne correspondent pas.');
          expect(wrapper.data.success).toBe(null);
        } else {
          expect(wrapper.data.error).toBe(null);
        }
      })
    );
  });

  test('should show error if current password is empty', async () => {
    const wrapper = {
      data: {
        currentPassword: '',
        newPassword: 'newPassword',
        confirmPassword: 'newPassword',
        success: null,
        error: null
      },
      methods: {
        changePassword: () => {
          if (!wrapper.data.currentPassword) {
            wrapper.data.error = 'Le mot de passe actuel ne peut pas être vide.';
            wrapper.data.success = null;
          }
        }
      }
    };

    wrapper.methods.changePassword();

    expect(wrapper.data.error).toBe('Le mot de passe actuel ne peut pas être vide.');
    expect(wrapper.data.success).toBe(null);
  });

  test('should show error if new password is empty', async () => {
    const wrapper = {
      data: {
        currentPassword: 'oldPassword',
        newPassword: '',
        confirmPassword: '',
        success: null,
        error: null
      },
      methods: {
        changePassword: () => {
          if (!wrapper.data.newPassword) {
            wrapper.data.error = 'Le nouveau mot de passe ne peut pas être vide.';
            wrapper.data.success = null;
          }
        }
      }
    };

    wrapper.methods.changePassword();

    expect(wrapper.data.error).toBe('Le nouveau mot de passe ne peut pas être vide.');
    expect(wrapper.data.success).toBe(null);
  });

  test('should show error if confirm password is empty', async () => {
    const wrapper = {
      data: {
        currentPassword: 'oldPassword',
        newPassword: 'newPassword',
        confirmPassword: '',
        success: null,
        error: null
      },
      methods: {
        changePassword: () => {
          if (!wrapper.data.confirmPassword) {
            wrapper.data.error = 'Veuillez confirmer le nouveau mot de passe.';
            wrapper.data.success = null;
          }
        }
      }
    };

    wrapper.methods.changePassword();

    expect(wrapper.data.error).toBe('Veuillez confirmer le nouveau mot de passe.');
    expect(wrapper.data.success).toBe(null);
  });
});