import type { Meta, StoryObj } from '@storybook/react';
import { Table } from './Table';
import { columnDefinitions } from '../data/columns';
import { getData } from '../data/data';

const meta = {
  title: 'Table/Filtering',
  component: Table,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  // tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
  render: (args, { data }) => <Table {...args} {...data} />,
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Keyup: Story = {
  args: {
    columnDefinitions
  },
  loaders: [
    async () => ({
      data: await getData(),
    })
  ],
};