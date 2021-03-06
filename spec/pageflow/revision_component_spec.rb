require 'spec_helper'

module Pageflow
  describe RevisionComponent do

    class TestRevisionComponent < ActiveRecord::Base
      include RevisionComponent
      self.table_name = :test_revision_components
    end

    describe '#perma_id' do
      it 'is set on creation' do
        revision_component = TestRevisionComponent.create!

        expect(revision_component.perma_id).to be_present
      end

      it 'differs for separate RevisonComponents' do
        revision_component1 = TestRevisionComponent.create!
        revision_component2 = TestRevisionComponent.create!

        expect(revision_component1.perma_id).not_to eq(revision_component2.perma_id)
      end
    end

    describe '#copy_to' do
      it 'keeps perma_id' do
        revision_component = TestRevisionComponent.create!
        revision = create(:revision)

        revision_component.copy_to(revision)
        revision_component_copy = TestRevisionComponent.all_for_revision(revision).first
        expect(revision_component.perma_id).to eq(revision_component_copy.perma_id)
      end
    end

    describe '#from_perma_ids' do
      it 'returns list of RevisionComponents' do
        revision = create(:revision)
        revision_component = TestRevisionComponent.create!(revision: revision)

        components = TestRevisionComponent.from_perma_ids(revision, [revision_component.perma_id])

        expect(components).to eq([revision_component])
      end
    end
  end
end
