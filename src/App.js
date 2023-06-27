import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";
import { useRef } from "react";
function App() {
  const [tweets, settweets] = useState([]);

  const nameRef = useRef();
  const [tweet, setTweet] = useState("");

  async function getTweet() {
    console.log("inside function");
    let data = await fetch(
      "https://apex.oracle.com/pls/apex/rakshitha_s/tweets/get"
    );
    let twitterdata = await data.json();
    settweets(twitterdata.items);
  }
  async function postTweet() {
    setTweet("");
    let date = new Date();
    let datetime =
      date.getDate() +
      "-" +
      parseInt(date.getMonth() + 1) +
      "-" +
      date.getFullYear();
    let rakHours = date.getHours();
    let ampm = "am";
    if (rakHours > 12) {
      rakHours = rakHours - 12;
      ampm = "pm";
    }
    let gettime = rakHours + ":" + date.getMinutes() + ampm;
    let post = await fetch(
      `https://apex.oracle.com/pls/apex/rakshitha_s/tweets/post?name=${nameRef.current.value}&tweet=${tweet}&likes=0&datetime=${datetime}&time=${gettime}`,
      { method: "post" }
    );

    getTweet();
  }

  useEffect(() => {
    getTweet();
  }, []);

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-3 ">
            <i className="bi bi-twitter text-primary h1"></i>
          </div>

          <div className="col-6 border">
            <div className="row">
              <div className="col">
                <h3>Home</h3>
              </div>
            </div>

            <div className="row">
              <div className="col-2 text-center">
                <i className="bi bi-person-circle h1"></i>
              </div>
              <div className="col-10">
                <div className="input-group mb-3 w-100 m-auto">
                  <span
                    className="input-group-text"
                    id="inputGroup-sizing-default"
                  >
                    Name
                  </span>
                  <input
                    ref={nameRef}
                    type="text"
                    className="form-control"
                    aria-label="Sizing example input"
                    aria-describedby="inputGroup-sizing-default"
                  />
                </div>
                <div className="input-group mb-3 w-100 m-auto">
                  <input
                    value={tweet}
                    onChange={(event) => {
                      setTweet(event.target.value);
                    }}
                    type="text"
                    className="form-control"
                    aria-label="Sizing example input"
                    aria-describedby="inputGroup-sizing-default"
                    placeholder="whats happening?"
                  />
                </div>
                <button
                  className={`btn btn-primary float-end my-2 ${
                    tweet === "" ? "disabled" : ""
                  }`}
                  onClick={postTweet}
                >
                  Tweet
                </button>
              </div>
            </div>

            {tweets.map((element) => {
              return (
                <>
                  <div className="container"></div>
                  <div className="row">
                    <div className="col">
                      <div className="card m-auto w-100">
                        <div className="card-body">
                          <div className="container">
                            <div className="row">
                              <div className="col-2">
                                <i className="bi bi-person-circle h1"></i>
                              </div>
                              <div className="col-10">
                                <h4 className="fs-5">
                                  {element.name} on{" "}
                                  <span className="fs-6">
                                    {element.datetime}
                                  </span>{" "}
                                  at{" "}
                                  <span className="fs-6">{element.time}</span>
                                </h4>
                                <p className="fs-2">{element.tweet}</p>
                                <div>
                                  {" "}
                                  <i
                                    onClick={async () => {
                                      let likeData = localStorage.getItem("likes")
                                      if (likeData){
                                        likeData = JSON.parse(likeData)
                                        for (let i = 0 ; i < likeData.length ; i++){
                                          if(likeData[i].tweet == element.tweet){
                                            
                                             return
                                            
                                          }
                                        }
                                        likeData.push({tweet:element.tweet , like:true})
                                        likeData = JSON.stringify(likeData)
                                        localStorage.setItem("likes", likeData)
                                      }
                                      else{
                                        likeData = []
                                        likeData.push({tweet:element.tweet , like:true})
                                        likeData = JSON.stringify(likeData)
                                        localStorage.setItem("likes", likeData)
                                      }
                                      await fetch(
                                        `https://apex.oracle.com/pls/apex/rakshitha_s/tweets/like?tweet=${element.tweet}`,
                                        { method: "POST" }
                                      );
                                      getTweet();
                                    }}
                                    className="bi bi-heart-fill mx-1"
                                  ></i>
                                  {element.likes}
                                </div>
                                <div className="menu position-absolute top-0 end-0 px-3 dropdown">
                                  <i class="bi bi-three-dots dropdown-toggle " data-bs-toggle="dropdown" aria-expanded="false"></i>{" "}
                                  <ul class="dropdown-menu">
                                    <li>
                                      <a class="dropdown-item" href="#">
                                        Request delete
                                      </a>
                                    </li>
                                    <li>
                                      <a onClick={async () => {
                                        let reportData = localStorage.getItem("report")
                                        if (reportData){
                                          reportData = JSON.parse(reportData)
                                          for (let i = 0 ; i < reportData.length ; i++){
                                            if(reportData[i].tweet == element.tweet){
                                              
                                               return
                                              
                                            }
                                          }
                                          reportData.push({tweet:element.tweet , report:true})
                                          reportData = JSON.stringify(reportData)
                                          localStorage.setItem("report", reportData)
                                        }
                                        else{
                                          reportData = []
                                          reportData.push({tweet:element.tweet , report:true})
                                          reportData = JSON.stringify(reportData)
                                          localStorage.setItem("report", reportData)
                                        }
                                        await fetch(
                                          `https://apex.oracle.com/pls/apex/rakshitha_s/tweets/report?tweet=${element.tweet}`,
                                          { method: "POST" }
                                        );
                                        getTweet();

                                      }
                                      } class="dropdown-item" href="#">
                                        Report
                                      </a>
                                    </li>
                                    <li>
                                      <a class="dropdown-item" href="#">
                                        Don't show
                                      </a>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              );
            })}
          </div>

          <div className="col-3">
            <div className="row">
              <div className="col">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search tweets"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <span
        style={{ width: 25, height: 25 }}
        className="bg-primary bg-opacity-25 p-4 m-3 rounded-circle position-absolute bottom-0 end-0 d-flex justify-content-center align-items-center"
      >
        {" "}
        R{" "}
      </span>
    </>
  );
}

export default App;
