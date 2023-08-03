
const Recommendations = ({ userDetails }) => {


  const { username, favoriteGenre } = userDetails.data.me


  return (
    <div>
      <h2>{username} {favoriteGenre}</h2>
    </div>
  )
}

export default Recommendations
