import React from 'react'
import PageLayout from "../Layout/PageLayout"
import bg2 from "../../assets/bg2.jpg"

function Message() {
  const right = <img src={bg2} alt="Director" style={{width:'100%', maxWidth:360, height:320, objectFit:'cover', borderRadius:16}} />
  return (
    <PageLayout
      title="Secretary / Director Message"
      quote="Education is transformation, and every child deserves the best."
      description="Our focus is to build a nurturing environment where students are inspired to learn, lead, and serve with integrity."
      rightSlot={right}
    >
      <p>
        We are committed to creating opportunities that encourage curiosity, collaboration, and excellence. Through inclusive practices and modern pedagogy, we ensure that every learner progresses with confidence and compassion.
      </p>
    </PageLayout>
  )
}

export default Message