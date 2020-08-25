import React, { useState } from 'react';
import Contributor from '../models/Contributor';

import MoreInfoIcon from 'mdi-react/InfoCircleOutlineIcon';
import { Dialog, DialogTitle, DialogContent, Chip, Typography, DialogActions, Button, makeStyles, Link, useTheme } from '@material-ui/core';

import TwitterIcon from 'mdi-react/TwitterIcon';
import GithubIcon from 'mdi-react/GithubIcon';
import DiscordIcon from 'mdi-react/DiscordIcon';
import ForumsIcon from 'mdi-react/FlightTakeoffIcon';

/**
 * Nicely displays a contributor's info
 *
 * @export
 *
 * @param {Object} props
 * @param {Contributor} props.contributor
 * @param {string} props.className
 *
 * @return {*}
 */
export default function ContributorBadge(props) {
  const { contributor, className } = props;
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <Chip className={className} icon={<MoreInfoIcon />} label={contributor.name} onClick={() => setDialogOpen(true)} variant="outlined" />
      <ContributorDialog contributor={contributor} onClose={() => setDialogOpen(false)} open={dialogOpen} />
    </>
  );
}

/**
 * Displays a contributor's info in a dialog
 *
 * @param {Object} props
 * @param {Contributor} props.contributor instance of contributor whose info is to be displayed
 * @param {Function} props.onClose callback fired when dialog is to be closed
 * @param {Boolean} props.open isDialogOpen
 */
function ContributorDialog(props) {
  const { contributor, open, onClose } = props;

  const theme = useTheme();

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Contributor info</DialogTitle>
      <DialogContent style={{ minWidth: 300 }}>
        <ContributorDialogSection fieldName="Name" value={contributor.name} />
        {contributor.twitter && (
          <ContributorDialogSection
            fieldName="Twitter"
            value={
              // Implemented some checks in case someone did a dumb dumb
              // and didn't include the @ in the JSON manifest
              <Link
                target="_blank"
                href={'https://twitter.com/' + (contributor.twitter.startsWith('@') ? contributor.twitter.slice(1) : contributor.twitter)}
                style={{ lineHeight: '24px' }}
              >
                <TwitterIcon style={{ verticalAlign: 'middle', marginRight: 4 }} color={theme.palette.primary.main} />
                {contributor.twitter.startsWith('@') ? contributor.twitter : '@' + contributor.twitter}
              </Link>
            }
          />
        )}
        {contributor.github && (
          <ContributorDialogSection
            fieldName="GitHub"
            value={
              <Link target="_blank" href={'https://github.com/' + contributor.github} style={{ lineHeight: '24px' }}>
                <GithubIcon style={{ verticalAlign: 'middle', marginRight: 4 }} color={theme.palette.primary.main} />
                {contributor.github}
              </Link>
            }
          />
        )}
        {contributor.discord && (
          <ContributorDialogSection
            fieldName="Discord"
            value={
              <span style={{ lineHeight: '24px', userSelect: 'text' }}>
                <DiscordIcon style={{ verticalAlign: 'middle', marginRight: 4 }} color={theme.palette.primary.main} />
                {contributor.discord}
              </span>
            }
          />
        )}
        {contributor.msfsforums && (
          <ContributorDialogSection
            fieldName="Flight Simulator Forums"
            value={
              <Link target="_blank" href={'https://forums.flightsimulator.com/u/' + contributor.msfsforums} style={{ lineHeight: '24px' }}>
                <ForumsIcon style={{ verticalAlign: 'middle', marginRight: 4 }} color={theme.palette.primary.main} />
                {contributor.msfsforums}
              </Link>
            }
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="text" color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

const useDialogSectionStyles = makeStyles({
  sectTitle: { textTransform: 'uppercase', marginBottom: 2 },
});

/**
 * Generates a section of the [ContributorDialog] from a field name and value.
 *
 * @param {Object} props
 * @param {string} props.fieldName Section title
 * @param {string|React.ReactNode} props.value Section value/description
 *
 * @return {React.ReactNode}
 */
function ContributorDialogSection(props) {
  const classes = useDialogSectionStyles();

  const { fieldName, value } = props;

  return (
    <>
      <Typography className={classes.sectTitle} variant="caption" color="textSecondary" component="h2">
        {fieldName}
      </Typography>
      <Typography variant="body2" gutterBottom component="div">
        {value}
      </Typography>
    </>
  );
}
