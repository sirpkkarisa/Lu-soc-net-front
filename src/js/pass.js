(()=> {
    const resetPasswordToken = location.search.split('?reset-password-token=')[1];
    const resetPassForm = document.getElementById('reset-pass-form');
    
    resetPassForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newPassword = document.getElementById('new-password').value.trim();
         const confirmPassword = document.getElementById('confirm-password').value.trim();
        console.log(newPassword+'\n'+confirmPassword)
        if (!newPassword || !confirmPassword) {
            alert('All fields are required');
            return;
        }
        if (newPassword.length < 6) {
            alert('Password Is too short')
            return;
        }
        if (newPassword !== confirmPassword) {
            alert('Password Mismatch')
            return;
        }
        if(resetPasswordToken.length !== 40) {
            alert('Please use secure Link to complete this process');
            return;
        }
        fetch('http://localhost:5001/auth/reset-password',{
            method: 'PATCH',
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({
                password: newPassword,
                resetPasswordToken
            })
        })
        .then((res)=> res.json())
        .then((res)=> console.log(res))
        .catch((error)=> console.log(error))
    })
   })()