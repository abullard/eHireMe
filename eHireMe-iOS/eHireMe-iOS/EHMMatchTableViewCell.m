//
//  EHMMatchTableViewCell.m
//  eHireMe-iOS
//
//  Created by Mac Liu on 3/8/16.
//  Copyright © 2016 eHireMe. All rights reserved.
//

#import "EHMMatchTableViewCell.h"

@implementation EHMMatchTableViewCell

- (void)awakeFromNib {
    // Initialization code
    self.profilePicture.layer.cornerRadius = self.profilePicture.frame.size.width / 2.0f;
    self.profilePicture.clipsToBounds = YES;
    self.profilePicture.contentMode = UIViewContentModeScaleAspectFill;
    self.profilePicture.layer.borderColor = [UIColor whiteColor].CGColor;
    self.profilePicture.backgroundColor = [UIColor colorWithWhite:0.9 alpha:0.5];
    self.profilePicture.layer.borderWidth = 2.0f;
}

- (void)setSelected:(BOOL)selected animated:(BOOL)animated {
    [super setSelected:selected animated:animated];

    // Configure the view for the selected state
}

@end
