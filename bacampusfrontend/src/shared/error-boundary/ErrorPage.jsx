import React from 'react';
import { logout } from '../../features/account/api/accountApi';
import '../../assets/scss/ErrorPage.scss';


const ErrorPage = () => {

  const handleLoginButtonClick = async () => {
    try {
      await logout();
      sessionStorage.removeItem('savedData');
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = '/Account';
    } catch (error) {
      // Eğer kullanıcı hiç giriş yapmamışsa ve logout işlemi hata veriyorsa
      if (error.response && error.response.status === 401) {
        // Doğrudan '/Account' sayfasına yönlendir
        window.location.href = '/Account';
      } else if (error.response && error.response.status === 500) {
        // Sunucu hatası durumunda da yine '/Account' sayfasına yönlendir
        window.location.href = '/Account';
      } else {
        // Eğer error.response tanımlı değilse de '/Account' sayfasına yönlendir
        window.location.href = '/Account';
        // Diğer hata durumlarını konsola yazdırabilirsiniz
        console.error('Çıkış işlemi sırasında bir hata oluştu:', error.message);
      }
    }
  };

  return (
    <section className="errorpage-flex errorpage-items-center errorpage-h-full errorpage-p-16 errorpage-dark-bg-gray-900 errorpage-dark-text-gray-100 no-scrollbar">
      <div className="errorpage-container errorpage-flex errorpage-flex-row errorpage-justify-center errorpage-my-8">
        <div className="errorpage-max-w-md errorpage-text-center errorpage-mr-8">
          <h2 className="errorpage-mb-8 errorpage-font-extrabold errorpage-text-9xl errorpage-dark-text-gray-600">
            OOPS! <br></br> Bir hata oluştu!
          </h2>
          <p className="errorpage-text-2xl errorpage-font-semibold errorpage-md-text-3xl">Üzgünüz, bu sayfaya ulaşamadık.</p>
          <p className="errorpage-mt-4 errorpage-mb-8 errorpage-dark-text-gray-400">Ancak endişelenmeyin, tekrar giriş yapıp işlemlerinize devam edebilirsiniz.</p>
          <button className="errorpage-button" onClick={handleLoginButtonClick}>
            Giriş Ekranına Dön
          </button>
        </div>
        <div className="errorpage-img-container">
          <img src="https://www.kindpng.com/picc/m/164-1646889_error-png-page-something-went-wrong-png-transparent.png" alt="Error Png Page - Something Went Wrong Png, Transparent Png@kindpng.com" className='errorpage-img' />
        </div>
      </div>
    </section>
  );
};
export default ErrorPage;
