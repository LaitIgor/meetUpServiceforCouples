import AppTemplateHOC from '../../HOCs/AppTemplateHOC';

const AppHome = () => {
    return <><h1>Content Title Home</h1> 
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio
        fugiat quibusdam asperiores beatae quia facilis minus modi voluptas 
        nobis deleniti iure porro veniam voluptatem delectus magni eligendi ducimus, natus quos.
        </p>
      </>
  }

  export default AppTemplateHOC(AppHome);