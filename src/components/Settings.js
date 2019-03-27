import React from "react";
import { Button, Popup, Grid, Segment } from "semantic-ui-react";

const popupStyle = {
  opacity: 0.9,
  padding: "0.25em"
};

const colours = ["red", "blue", "green", "orange", "violet", "teal"];

const Settings = ({ player, colour, changeColour, changePlayer }) => (
  <Popup
    trigger={<Button inverted icon="setting" />}
    flowing
    hoverable
    inverted
    style={popupStyle}
    size="small"
  >
    <Grid divided inverted>
      <Grid.Row
        columns={2}
        verticalAlign="middle"
        color="black"
        textAlign="center"
      >
        <Grid.Column width={6}>
          <Segment color="black" inverted>
            <Button
              inverted
              active
              circular
              size="huge"
              color={colour}
              onClick={() => changePlayer()}
            >
              {player}
            </Button>
          </Segment>
        </Grid.Column>
        <Grid.Column width={10}>
          <Segment color="black" inverted>
            {colours.map(c => (
              <Button
                inverted
                circular
                color={c}
                active={colour === c}
                onClick={() => changeColour(player, c)}
              />
            ))}
          </Segment>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  </Popup>
);

export default Settings;
